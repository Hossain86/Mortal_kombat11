import mongoose from 'mongoose';

/**
 * Player Schema
 * Tracks player statistics and character usage within a tournament
 */
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    minlength: [2, 'Player name must be at least 2 characters'],
    maxlength: [50, 'Player name cannot exceed 50 characters']
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament reference is required']
  },
  // Statistics
  matchesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  wins: {
    type: Number,
    default: 0,
    min: 0
  },
  // Character usage tracking: { characterName: usageCount }
  charactersUsed: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Compound index to ensure unique player names within a tournament
playerSchema.index({ name: 1, tournament: 1 }, { unique: true });

// Virtual for win rate calculation
playerSchema.virtual('winRate').get(function() {
  if (this.matchesPlayed === 0) return 0;
  return Math.round((this.wins / this.matchesPlayed) * 100);
});

// Method to update stats after a match
playerSchema.methods.updateStats = function(won, character) {
  this.matchesPlayed += 1;
  if (won) {
    this.wins += 1;
  }
  
  // Update character usage
  const currentUsage = this.charactersUsed.get(character) || 0;
  this.charactersUsed.set(character, currentUsage + 1);
  
  return this.save();
};

// Method to get most played character
playerSchema.methods.getMostPlayedCharacter = function() {
  if (this.charactersUsed.size === 0) return null;
  
  let maxCharacter = null;
  let maxUsage = 0;
  
  this.charactersUsed.forEach((usage, character) => {
    if (usage > maxUsage) {
      maxUsage = usage;
      maxCharacter = character;
    }
  });
  
  return { character: maxCharacter, usage: maxUsage };
};

// Ensure virtuals are included in JSON output
playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;
