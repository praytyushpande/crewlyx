const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure exactly 2 users per match
matchSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('A match must have exactly 2 users'));
  }
  
  // Ensure users are different
  if (this.users[0].toString() === this.users[1].toString()) {
    return next(new Error('Cannot match a user with themselves'));
  }
  
  next();
});

// Index for efficient queries
matchSchema.index({ users: 1 });
matchSchema.index({ isActive: 1 });
matchSchema.index({ createdAt: -1 });

// Static method to find matches for a user
matchSchema.statics.findUserMatches = function(userId) {
  return this.find({
    users: userId,
    isActive: true
  }).populate('users', '-password -swipeActions').sort({ updatedAt: -1 });
};

// Method to get the other user in a match
matchSchema.methods.getOtherUser = function(currentUserId) {
  return this.users.find(user => user._id.toString() !== currentUserId.toString());
};

module.exports = mongoose.model('Match', matchSchema);