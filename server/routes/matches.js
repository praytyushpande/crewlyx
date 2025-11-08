const express = require('express');
const Match = require('../models/Match');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/matches
// @desc    Get all matches for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ users: req.user.userId })
      .populate('users', 'name profilePhoto bio skills location age')
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt'
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Transform matches to include the other user's info
    const transformedMatches = matches.map(match => {
      const otherUser = match.users.find(user => user._id.toString() !== req.user.userId);
      return {
        _id: match._id,
        otherUser,
        lastMessage: match.lastMessage,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt
      };
    });

    const totalMatches = await Match.countDocuments({ users: req.user.userId });

    res.json({
      success: true,
      data: {
        matches: transformedMatches,
        totalCount: totalMatches,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMatches / limit)
      }
    });

  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching matches',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/matches/:matchId
// @desc    Get specific match details
// @access  Private
router.get('/:matchId', async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate('users', 'name profilePhoto bio skills location age interests lookingFor')
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt'
      });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if current user is part of this match
    const isUserInMatch = match.users.some(user => user._id.toString() === req.user.userId);
    
    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this match'
      });
    }

    // Get the other user's info
    const otherUser = match.users.find(user => user._id.toString() !== req.user.userId);

    res.json({
      success: true,
      data: {
        match: {
          _id: match._id,
          otherUser,
          lastMessage: match.lastMessage,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/matches/:matchId
// @desc    Unmatch (delete a match)
// @access  Private
router.delete('/:matchId', async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if current user is part of this match
    const isUserInMatch = match.users.some(user => user._id.toString() === req.user.userId);
    
    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this match'
      });
    }

    // Delete the match
    await Match.findByIdAndDelete(req.params.matchId);

    // Optional: Also delete all messages related to this match
    // await Message.deleteMany({ match: req.params.matchId });

    res.json({
      success: true,
      message: 'Match deleted successfully'
    });

  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting match',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/matches/stats
// @desc    Get match statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const totalMatches = await Match.countDocuments({ users: req.user.userId });
    
    // Get recent matches (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMatches = await Match.countDocuments({
      users: req.user.userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get matches with messages
    const matchesWithMessages = await Match.countDocuments({
      users: req.user.userId,
      lastMessage: { $exists: true }
    });

    const stats = {
      totalMatches,
      recentMatches,
      matchesWithMessages,
      conversationRate: totalMatches > 0 ? ((matchesWithMessages / totalMatches) * 100).toFixed(1) : 0
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;