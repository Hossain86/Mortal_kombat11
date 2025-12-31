import mongoose from 'mongoose';

/**
 * Match Schema
 * Records individual matches between two players with character selections
 */
const matchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament reference is required']
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Player 1 is required']
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: [true, 'Player 2 is required']
  },
  player1Character: {
    type: String,
    required: [true, 'Player 1 character is required'],
    trim: true
  },
  player2Character: {
    type: String,
    required: [true, 'Player 2 character is required'],
    trim: true
  },
  matchType: {
    type: String,
    enum: ['normal', 'final'],
    default: 'normal',
    required: true
  },
  status: {
    type: String,
    enum: ['live', 'completed'],
    default: 'live',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null,
    validate: {
      validator: function(value) {
        // Winner must be one of the players if status is completed
        if (this.status === 'completed' && value) {
          return value.equals(this.player1) || value.equals(this.player2);
        }
        return true;
      },
      message: 'Winner must be one of the match players'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
matchSchema.index({ tournament: 1, createdAt: -1 });
matchSchema.index({ status: 1 });

// Validate that players are different
matchSchema.pre('save', function(next) {
  if (this.player1.equals(this.player2)) {
    next(new Error('Player 1 and Player 2 must be different'));
  }
  next();
});

// Method to complete match and set winner
matchSchema.methods.completeMatch = async function(winnerId) {
  if (this.status === 'completed') {
    throw new Error('Match is already completed');
  }
  
  this.status = 'completed';
  this.winner = winnerId;
  return this.save();
};

// Method to check if this is a championship match
matchSchema.methods.isFinal = function() {
  return this.matchType === 'final';
};

const Match = mongoose.model('Match', matchSchema);

export default Match;
