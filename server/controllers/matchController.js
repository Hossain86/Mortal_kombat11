import Match from '../models/Match.js';
import Player from '../models/Player.js';
import Tournament from '../models/Tournament.js';

/**
 * Match Controller
 * Handles all match-related operations including match completion and winner declaration
 */

/**
 * @desc    Get all matches
 * @route   GET /api/matches?tournament=:tournamentId
 * @access  Public
 */
export const getAllMatches = async (req, res) => {
  try {
    const { tournament, status } = req.query;

    const filter = {};
    if (tournament) filter.tournament = tournament;
    if (status) filter.status = status;

    const matches = await Match.find(filter)
      .populate('tournament', 'name status')
      .populate('player1', 'name')
      .populate('player2', 'name')
      .populate('winner', 'name')
      .sort({ createdAt: -1 }); // Latest matches first

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching matches',
      error: error.message
    });
  }
};

/**
 * @desc    Get single match by ID
 * @route   GET /api/matches/:id
 * @access  Public
 */
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('tournament', 'name status')
      .populate('player1', 'name matchesPlayed wins')
      .populate('player2', 'name matchesPlayed wins')
      .populate('winner', 'name');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match',
      error: error.message
    });
  }
};

/**
 * @desc    Create new match
 * @route   POST /api/matches
 * @access  Public
 */
export const createMatch = async (req, res) => {
  try {
    const { 
      tournament, 
      player1, 
      player2, 
      player1Character, 
      player2Character, 
      matchType, 
      status,
      winner
    } = req.body;

    // Validate tournament exists and is not ended
    const tournamentDoc = await Tournament.findById(tournament);
    if (!tournamentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (tournamentDoc.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add matches to ended tournament'
      });
    }

    // Validate players exist and belong to tournament
    const player1Doc = await Player.findById(player1);
    const player2Doc = await Player.findById(player2);

    if (!player1Doc || !player2Doc) {
      return res.status(404).json({
        success: false,
        message: 'One or both players not found'
      });
    }

    if (!player1Doc.tournament.equals(tournament) || !player2Doc.tournament.equals(tournament)) {
      return res.status(400).json({
        success: false,
        message: 'Players must belong to the specified tournament'
      });
    }

    // If status is completed, winner is required
    if (status === 'completed' && !winner) {
      return res.status(400).json({
        success: false,
        message: 'Winner is required for completed matches'
      });
    }

    // Validate winner is one of the players if provided
    if (winner && !player1Doc._id.equals(winner) && !player2Doc._id.equals(winner)) {
      return res.status(400).json({
        success: false,
        message: 'Winner must be one of the match players'
      });
    }

    // Create match
    const match = await Match.create({
      tournament,
      player1,
      player2,
      player1Character,
      player2Character,
      matchType: matchType || 'normal',
      status: status || 'live',
      winner: status === 'completed' ? winner : null
    });

    // If match is completed, update player stats
    if (status === 'completed' && winner) {
      const loserId = player1Doc._id.equals(winner) ? player2 : player1;
      const winnerCharacter = player1Doc._id.equals(winner) ? player1Character : player2Character;
      const loserCharacter = player1Doc._id.equals(winner) ? player2Character : player1Character;

      await player1Doc.updateStats(player1Doc._id.equals(winner), player1Character);
      await player2Doc.updateStats(player2Doc._id.equals(winner), player2Character);

      // If this is a final match, set tournament winner and end tournament
      if (matchType === 'final') {
        await Tournament.findByIdAndUpdate(tournament, {
          winner: winner,
          status: 'ended',
          endTime: new Date()
        });
      }
    }

    // Add match to tournament's matches array
    await Tournament.findByIdAndUpdate(
      tournament,
      { $addToSet: { matches: match._id } }
    );

    const populatedMatch = await Match.findById(match._id)
      .populate('player1', 'name matchesPlayed wins')
      .populate('player2', 'name matchesPlayed wins')
      .populate('winner', 'name')
      .populate('tournament', 'name status');

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: populatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating match',
      error: error.message
    });
  }
};

/**
 * @desc    Complete match and declare winner
 * @route   PUT /api/matches/:id/complete
 * @access  Public
 */
export const completeMatch = async (req, res) => {
  try {
    const { winnerId } = req.body;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: 'Winner ID is required'
      });
    }

    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (match.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Match is already completed'
      });
    }

    // Validate winner is one of the players
    if (!match.player1.equals(winnerId) && !match.player2.equals(winnerId)) {
      return res.status(400).json({
        success: false,
        message: 'Winner must be one of the match players'
      });
    }

    // Update match status and set winner
    match.status = 'completed';
    match.winner = winnerId;
    await match.save();

    // Update player statistics
    const loserId = match.player1.equals(winnerId) ? match.player2 : match.player1;
    const winnerCharacter = match.player1.equals(winnerId) ? match.player1Character : match.player2Character;
    const loserCharacter = match.player1.equals(winnerId) ? match.player2Character : match.player1Character;

    const winner = await Player.findById(winnerId);
    const loser = await Player.findById(loserId);

    await winner.updateStats(true, winnerCharacter);
    await loser.updateStats(false, loserCharacter);

    // If this is a final match, set tournament winner and end tournament
    if (match.matchType === 'final') {
      await Tournament.findByIdAndUpdate(match.tournament, {
        winner: winnerId,
        status: 'ended',
        endTime: new Date()
      });
    }

    const updatedMatch = await Match.findById(match._id)
      .populate('player1', 'name matchesPlayed wins')
      .populate('player2', 'name matchesPlayed wins')
      .populate('winner', 'name')
      .populate('tournament', 'name status winner');

    res.json({
      success: true,
      message: match.matchType === 'final' 
        ? 'Final match completed! Tournament winner declared!' 
        : 'Match completed successfully',
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error completing match',
      error: error.message
    });
  }
};

/**
 * @desc    Update match (allow editing all fields)
 * @route   PUT /api/matches/:id
 * @access  Public
 */
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const { player1, player2, player1Character, player2Character, matchType, status, winner } = req.body;
    
    // Track if we need to update stats
    const oldStatus = match.status;
    const oldWinner = match.winner;
    let needsStatUpdate = false;

    // Update allowed fields
    if (player1 !== undefined) match.player1 = player1;
    if (player2 !== undefined) match.player2 = player2;
    if (player1Character !== undefined) match.player1Character = player1Character;
    if (player2Character !== undefined) match.player2Character = player2Character;
    if (matchType !== undefined) match.matchType = matchType;
    if (status !== undefined) match.status = status;
    if (winner !== undefined) match.winner = winner;

    // Handle status change from live to completed or winner change
    if (status === 'completed' && oldStatus !== 'completed' && winner) {
      needsStatUpdate = true;
    } else if (status === 'completed' && oldStatus === 'completed' && winner && !oldWinner?.equals(winner)) {
      // Winner changed - reverse old stats and apply new ones
      if (oldWinner) {
        const oldWinnerPlayer = await Player.findById(oldWinner);
        const oldLoserPlayer = await Player.findById(
          match.player1.equals(oldWinner) ? match.player2 : match.player1
        );
        const oldWinnerChar = match.player1.equals(oldWinner) ? match.player1Character : match.player2Character;
        const oldLoserChar = match.player1.equals(oldWinner) ? match.player2Character : match.player1Character;
        
        // Reverse stats
        if (oldWinnerPlayer) {
          oldWinnerPlayer.wins = Math.max(0, oldWinnerPlayer.wins - 1);
          oldWinnerPlayer.matchesPlayed = Math.max(0, oldWinnerPlayer.matchesPlayed - 1);
          if (oldWinnerChar && oldWinnerPlayer.charactersUsed.has(oldWinnerChar)) {
            oldWinnerPlayer.charactersUsed.set(oldWinnerChar, Math.max(0, oldWinnerPlayer.charactersUsed.get(oldWinnerChar) - 1));
          }
          await oldWinnerPlayer.save();
        }
        if (oldLoserPlayer) {
          oldLoserPlayer.matchesPlayed = Math.max(0, oldLoserPlayer.matchesPlayed - 1);
          if (oldLoserChar && oldLoserPlayer.charactersUsed.has(oldLoserChar)) {
            oldLoserPlayer.charactersUsed.set(oldLoserChar, Math.max(0, oldLoserPlayer.charactersUsed.get(oldLoserChar) - 1));
          }
          await oldLoserPlayer.save();
        }
      }
      needsStatUpdate = true;
    }

    await match.save();

    // Apply new stats if needed
    if (needsStatUpdate && winner) {
      const loserId = match.player1.equals(winner) ? match.player2 : match.player1;
      const winnerCharacter = match.player1.equals(winner) ? match.player1Character : match.player2Character;
      const loserCharacter = match.player1.equals(winner) ? match.player2Character : match.player1Character;

      const winnerPlayer = await Player.findById(winner);
      const loserPlayer = await Player.findById(loserId);

      if (winnerPlayer) await winnerPlayer.updateStats(true, winnerCharacter);
      if (loserPlayer) await loserPlayer.updateStats(false, loserCharacter);
    }

    const updatedMatch = await Match.findById(match._id)
      .populate('player1', 'name matchesPlayed wins')
      .populate('player2', 'name matchesPlayed wins')
      .populate('winner', 'name')
      .populate('tournament', 'name status');

    res.json({
      success: true,
      message: 'Match updated successfully',
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating match',
      error: error.message
    });
  }
};

/**
 * @desc    Delete match
 * @route   DELETE /api/matches/:id
 * @access  Public
 */
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (match.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete completed match. Stats have been updated.'
      });
    }

    // Remove match from tournament's matches array
    await Tournament.findByIdAndUpdate(
      match.tournament,
      { $pull: { matches: match._id } }
    );

    await match.deleteOne();

    res.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting match',
      error: error.message
    });
  }
};
