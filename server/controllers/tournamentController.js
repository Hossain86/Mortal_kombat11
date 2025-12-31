import Tournament from '../models/Tournament.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';

/**
 * Tournament Controller
 * Handles all tournament-related operations
 */

/**
 * @desc    Get all tournaments
 * @route   GET /api/tournaments
 * @access  Public
 */
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('winner', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournaments',
      error: error.message
    });
  }
};

/**
 * @desc    Get single tournament by ID
 * @route   GET /api/tournaments/:id
 * @access  Public
 */
export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('winner', 'name matchesPlayed wins winRate')
      .populate('players', 'name matchesPlayed wins winRate')
      .populate({
        path: 'matches',
        populate: [
          { path: 'player1', select: 'name' },
          { path: 'player2', select: 'name' },
          { path: 'winner', select: 'name' }
        ],
        options: { sort: { createdAt: -1 } } // Latest matches first
      });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournament',
      error: error.message
    });
  }
};

/**
 * @desc    Create new tournament
 * @route   POST /api/tournaments
 * @access  Public
 */
export const createTournament = async (req, res) => {
  try {
    const { name, status, startTime, endTime } = req.body;

    const tournament = await Tournament.create({
      name,
      status: status || 'upcoming',
      startTime,
      endTime
    });

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: tournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating tournament',
      error: error.message
    });
  }
};

/**
 * @desc    Update tournament
 * @route   PUT /api/tournaments/:id
 * @access  Public
 */
export const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Prevent modification if tournament has ended
    if (tournament.status === 'ended' && req.body.status !== 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify ended tournament'
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: updatedTournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating tournament',
      error: error.message
    });
  }
};

/**
 * @desc    Delete tournament
 * @route   DELETE /api/tournaments/:id
 * @access  Public
 */
export const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Delete all associated players and matches
    await Player.deleteMany({ tournament: req.params.id });
    await Match.deleteMany({ tournament: req.params.id });
    await tournament.deleteOne();

    res.json({
      success: true,
      message: 'Tournament and associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tournament',
      error: error.message
    });
  }
};

/**
 * @desc    Get tournament statistics
 * @route   GET /api/tournaments/:id/stats
 * @access  Public
 */
export const getTournamentStats = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    const totalPlayers = await Player.countDocuments({ tournament: req.params.id });
    const totalMatches = await Match.countDocuments({ tournament: req.params.id });
    const completedMatches = await Match.countDocuments({ 
      tournament: req.params.id, 
      status: 'completed' 
    });
    const liveMatches = await Match.countDocuments({ 
      tournament: req.params.id, 
      status: 'live' 
    });

    // Get top players by win rate
    const topPlayers = await Player.find({ tournament: req.params.id })
      .sort({ wins: -1, matchesPlayed: 1 })
      .limit(5)
      .select('name matchesPlayed wins');

    res.json({
      success: true,
      data: {
        totalPlayers,
        totalMatches,
        completedMatches,
        liveMatches,
        topPlayers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tournament statistics',
      error: error.message
    });
  }
};
