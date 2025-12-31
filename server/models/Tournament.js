import mongoose from 'mongoose';

/**
 * Tournament Schema
 * Manages tournament information including status and timing
 */
const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    minlength: [3, 'Tournament name must be at least 3 characters'],
    maxlength: [100, 'Tournament name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming',
    required: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  // Track players participating in this tournament
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  // Track all matches in this tournament
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }]
}, {
  timestamps: true
});

// Index for faster queries
tournamentSchema.index({ status: 1, startTime: -1 });

// Virtual for checking if tournament is active
tournamentSchema.virtual('isActive').get(function() {
  return this.status === 'live';
});

// Method to check if tournament can be modified
tournamentSchema.methods.canModify = function() {
  return this.status !== 'ended';
};

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
