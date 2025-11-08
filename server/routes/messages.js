const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Match = require('../models/Match');

const router = express.Router();

// @route   GET /api/messages/:matchId
// @desc    Get all messages for a match
// @access  Private
router.get('/:matchId', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify match exists and user is part of it
    const match = await Match.findById(req.params.matchId);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const isUserInMatch = match.users.some(user => user._id.toString() === req.user.userId);
    
    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    // Get messages
    const messages = await Message.find({ match: req.params.matchId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        match: req.params.matchId,
        sender: { $ne: req.user.userId },
        read: false
      },
      { read: true, readAt: new Date() }
    );

    const totalMessages = await Message.countDocuments({ match: req.params.matchId });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        totalCount: totalMessages,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/messages/:matchId
// @desc    Send a message in a match
// @access  Private
router.post('/:matchId', [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
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

    const { content } = req.body;

    // Verify match exists and user is part of it
    const match = await Match.findById(req.params.matchId).populate('users', 'name profilePhoto');
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const isUserInMatch = match.users.some(user => user._id.toString() === req.user.userId);
    
    if (!isUserInMatch) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    // Create new message
    const message = new Message({
      match: req.params.matchId,
      sender: req.user.userId,
      content,
      createdAt: new Date()
    });

    await message.save();
    await message.populate('sender', 'name profilePhoto');

    // Update match with last message
    match.lastMessage = message._id;
    match.updatedAt = new Date();
    await match.save();

    // Emit real-time message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`match-${req.params.matchId}`).emit('new-message', {
        message,
        matchId: req.params.matchId
      });

      // Notify the other user
      const otherUser = match.users.find(user => user._id.toString() !== req.user.userId);
      if (otherUser) {
        io.to(`user-${otherUser._id}`).emit('message-notification', {
          message,
          matchId: req.params.matchId,
          sender: req.user.userInfo
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    // Delete the message
    await Message.findByIdAndDelete(req.params.messageId);

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`match-${message.match}`).emit('message-deleted', {
        messageId: req.params.messageId,
        matchId: message.match
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread messages count
// @access  Private
router.get('/unread/count', async (req, res) => {
  try {
    // Get all matches for the user
    const matches = await Match.find({ users: req.user.userId });
    const matchIds = matches.map(match => match._id);

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      match: { $in: matchIds },
      sender: { $ne: req.user.userId },
      read: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching unread count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;