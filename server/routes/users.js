const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -swipeActions');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters'),
  
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('Age must be between 16 and 100'),
    
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
    
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
    
  body('lookingFor')
    .optional()
    .isIn(['co-founder', 'hackathon-partner', 'project-collaborator', 'mentor', 'any'])
    .withMessage('Invalid lookingFor value'),
    
  body('availability')
    .optional()
    .isIn(['full-time', 'part-time', 'weekends', 'flexible'])
    .withMessage('Invalid availability value')
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

    const updateData = {};
    const allowedFields = ['name', 'bio', 'location', 'age', 'skills', 'interests', 'lookingFor', 'availability', 'profilePhoto'];
    
    // Only include provided fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -swipeActions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/users/discover
// @desc    Get users for swiping (excluding already swiped users)
// @access  Private
router.get('/discover', async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get list of users to exclude (already swiped + current user)
    const swipedUserIds = currentUser.swipeActions.map(action => action.targetUserId);
    const excludeIds = [...swipedUserIds, currentUser._id];

    // Build query based on user preferences
    let query = {
      _id: { $nin: excludeIds },
      isActive: true
    };

    // Optional: Add filtering by preferences
    const { lookingFor, location, skills } = req.query;
    
    if (lookingFor && lookingFor !== 'any') {
      query.lookingFor = lookingFor;
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }

    const users = await User.find(query)
      .select('-password -swipeActions -email')
      .limit(20)
      .sort({ lastActive: -1 });

    res.json({
      success: true,
      data: { users },
      count: users.length
    });

  } catch (error) {
    console.error('Discover users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile info)
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -swipeActions -email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Increment profile views (if not viewing own profile)
    if (req.params.id !== req.user.userId) {
      await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/users/deactivate
// @desc    Deactivate user account
// @access  Private
router.post('/deactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isActive: false },
      { new: true }
    ).select('-password -swipeActions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/users/activate
// @desc    Reactivate user account
// @access  Private
router.post('/activate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isActive: true, lastActive: new Date() },
      { new: true }
    ).select('-password -swipeActions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account activated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Activate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;