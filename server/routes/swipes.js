const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Match = require('../models/Match');

const router = express.Router();

// @route   POST /api/swipes
// @desc    Swipe on a user (like or pass)
// @access  Private
router.post('/', [
  body('targetUserId')
    .notEmpty()
    .withMessage('Target user ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  body('action')
    .isIn(['like', 'pass'])
    .withMessage('Action must be either "like" or "pass"')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { targetUserId, action } = req.body;
    const currentUserId = req.user.userId;

    // Check if trying to swipe on themselves
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot swipe on yourself'
      });
    }

    // Find current user and target user
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId)
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has already swiped on this target
    const existingSwipe = currentUser.swipeActions.find(
      swipe => swipe.targetUserId.toString() === targetUserId
    );

    if (existingSwipe) {
      return res.status(400).json({
        success: false,
        message: 'You have already swiped on this user'
      });
    }

    // Add swipe action to current user
    await currentUser.addSwipeAction(targetUserId, action);

    let isMatch = false;
    let match = null;

    // Check for match only if current action is 'like'
    if (action === 'like') {
      // Update target user's total likes
      await User.findByIdAndUpdate(targetUserId, { $inc: { totalLikes: 1 } });

      // Check if it's a mutual like (match)
      isMatch = await User.checkMutualLike(currentUserId, targetUserId);
      
      if (isMatch) {
        // Create a new match
        match = new Match({
          users: [currentUserId, targetUserId],
          createdAt: new Date()
        });
        await match.save();

        // Populate the match with user details
        await match.populate('users', 'name profilePhoto bio skills');

        // Emit real-time match notification via Socket.IO
        const io = req.app.get('io');
        if (io) {
          io.to(`user-${currentUserId}`).emit('new-match', {
            match,
            matchedUser: targetUser
          });
          io.to(`user-${targetUserId}`).emit('new-match', {
            match,
            matchedUser: currentUser
          });
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully ${action}d user`,
      data: {
        action,
        targetUserId,
        isMatch,
        ...(match && { match })
      }
    });

  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing swipe',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/swipes/history
// @desc    Get user's swipe history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    
    const user = await User.findById(req.user.userId)
      .populate('swipeActions.targetUserId', 'name profilePhoto bio skills');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let swipeHistory = user.swipeActions;

    // Filter by action if specified
    if (action && ['like', 'pass'].includes(action)) {
      swipeHistory = swipeHistory.filter(swipe => swipe.action === action);
    }

    // Sort by most recent first
    swipeHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = swipeHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        swipes: paginatedHistory,
        totalCount: swipeHistory.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(swipeHistory.length / limit)
      }
    });

  } catch (error) {
    console.error('Get swipe history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching swipe history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/swipes/stats
// @desc    Get user's swipe statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalSwipes = user.swipeActions.length;
    const likes = user.swipeActions.filter(swipe => swipe.action === 'like').length;
    const passes = user.swipeActions.filter(swipe => swipe.action === 'pass').length;

    // Get matches count
    const matchesCount = await Match.countDocuments({ users: req.user.userId });

    const stats = {
      totalSwipes,
      likes,
      passes,
      matchesCount,
      totalLikes: user.totalLikes,
      profileViews: user.profileViews,
      likeRatio: totalSwipes > 0 ? ((likes / totalSwipes) * 100).toFixed(1) : 0,
      matchRatio: likes > 0 ? ((matchesCount / likes) * 100).toFixed(1) : 0
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get swipe stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching swipe statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;