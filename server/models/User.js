const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Must be at least 16 years old'],
    max: [100, 'Age cannot exceed 100']
  },
  skills: [{
    type: String,
    trim: true
  }],
  profilePhoto: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  experience: {
    type: String,
    trim: true
  },
  interests: [{
    type: String,
    trim: true
  }],
  lookingFor: {
    type: String,
    enum: ['co-founder', 'hackathon-partner', 'project-collaborator', 'mentor', 'any'],
    default: 'any'
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekends', 'flexible'],
    default: 'flexible'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  swipeActions: [{
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['like', 'pass'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  profileViews: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ lookingFor: 1 });
userSchema.index({ location: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'swipeActions.targetUserId': 1 });

// Virtual for matches
userSchema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive on login
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get swipeable users (exclude already swiped and current user)
userSchema.methods.getSwipeableUsers = function() {
  const swipedUserIds = this.swipeActions.map(action => action.targetUserId);
  
  return mongoose.model('User').find({
    _id: { 
      $nin: [...swipedUserIds, this._id] 
    },
    isActive: true
  }).select('-password -swipeActions');
};

// Add swipe action
userSchema.methods.addSwipeAction = function(targetUserId, action) {
  this.swipeActions.push({
    targetUserId,
    action,
    createdAt: new Date()
  });
  
  return this.save();
};

// Check if users have mutual likes
userSchema.statics.checkMutualLike = async function(userId1, userId2) {
  const user1 = await this.findById(userId1);
  const user2 = await this.findById(userId2);
  
  if (!user1 || !user2) return false;
  
  const user1LikesUser2 = user1.swipeActions.some(
    action => action.targetUserId.toString() === userId2.toString() && action.action === 'like'
  );
  
  const user2LikesUser1 = user2.swipeActions.some(
    action => action.targetUserId.toString() === userId1.toString() && action.action === 'like'
  );
  
  return user1LikesUser2 && user2LikesUser1;
};

module.exports = mongoose.model('User', userSchema);