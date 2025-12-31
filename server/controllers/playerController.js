import Player from '../models/Player.js';
import Tournament from '../models/Tournament.js';

/**
 * Player Controller
 * Handles all player-related operations
 */

/**
 * @desc    Get all players in a tournament
 * @route   GET /api/players?tournament=:tournamentId
 * @access  Public
 */
export const getAllPlayers = async (req, res) => {
  try {
    const { tournament } = req.query;

    const filter = tournament ? { tournament } : {};
    const players = await Player.find(filter)
      .populate('tournament', 'name status')
      .sort({ wins: -1, matchesPlayed: 1 });

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching players',
      error: error.message
    });
  }
};

/**
 * @desc    Get single player by ID
 * @route   GET /api/players/:id
 * @access  Public
 */
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('tournament', 'name status');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Convert charactersUsed Map to array for easier frontend handling
    const charactersArray = Array.from(player.charactersUsed.entries()).map(([character, usage]) => ({
      character,
      usage
    })).sort((a, b) => b.usage - a.usage);

    const playerData = player.toObject();
    playerData.charactersUsedArray = charactersArray;

    res.json({
      success: true,
      data: playerData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player',
      error: error.message
    });
  }
};

/**
 * @desc    Create new player
 * @route   POST /api/players
 * @access  Public
 */
export const createPlayer = async (req, res) => {
  try {
    const { name, tournament } = req.body;

    // Check if tournament exists
    const tournamentExists = await Tournament.findById(tournament);
    if (!tournamentExists) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament can be modified
    if (tournamentExists.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add players to ended tournament'
      });
    }

    const player = await Player.create({ name, tournament });

    // Add player to tournament's players array
    await Tournament.findByIdAndUpdate(
      tournament,
      { $addToSet: { players: player._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player
    });
  } catch (error) {
    // Handle duplicate player name in same tournament
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Player with this name already exists in the tournament'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating player',
      error: error.message
    });
  }
};

/**
 * @desc    Update player
 * @route   PUT /api/players/:id
 * @access  Public
 */
export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Only allow updating name, not stats
    const { name } = req.body;
    if (name) {
      player.name = name;
      await player.save();
    }

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating player',
      error: error.message
    });
  }
};

/**
 * @desc    Delete player
 * @route   DELETE /api/players/:id
 * @access  Public
 */
export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Check if player has matches
    const Match = (await import('../models/Match.js')).default;
    const hasMatches = await Match.exists({
      $or: [{ player1: req.params.id }, { player2: req.params.id }]
    });

    if (hasMatches) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete player with existing matches'
      });
    }

    // Remove player from tournament's players array
    await Tournament.findByIdAndUpdate(
      player.tournament,
      { $pull: { players: player._id } }
    );

    await player.deleteOne();

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting player',
      error: error.message
    });
  }
};

/**
 * @desc    Get player match history
 * @route   GET /api/players/:id/matches
 * @access  Public
 */
export const getPlayerMatches = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    const Match = (await import('../models/Match.js')).default;
    const matches = await Match.find({
      $or: [{ player1: req.params.id }, { player2: req.params.id }]
    })
      .populate('player1', 'name')
      .populate('player2', 'name')
      .populate('winner', 'name')
      .populate('tournament', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player matches',
      error: error.message
    });
  }
};
