const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: [true, 'Match ID is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ matchId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isRead: 1 });

// Mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Get messages for a match
messageSchema.statics.getMatchMessages = function(matchId, limit = 50) {
  return this.find({ matchId })
    .populate('sender', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get unread message count for a user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.aggregate([
    {
      $lookup: {
        from: 'matches',
        localField: 'matchId',
        foreignField: '_id',
        as: 'match'
      }
    },
    {
      $match: {
        'match.users': mongoose.Types.ObjectId(userId),
        sender: { $ne: mongoose.Types.ObjectId(userId) },
        isRead: false
      }
    },
    {
      $count: 'unreadCount'
    }
  ]);
};

module.exports = mongoose.model('Message', messageSchema);