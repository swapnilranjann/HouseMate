const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const response = require('../utils/response');

/**
 * @route   GET /api/chats
 * @desc    Find all active communication channels for identity
 */
router.get('/', auth, async (req, res) => {
  try {
    const filter = { participants: req.user.id };
    const chats = await Chat.find(filter)
      .populate('appointmentId')
      .populate('participants', 'name email role phone')
      .sort({ updatedAt: -1 });
    
    response.success(res, chats, 'Communication channels synchronised.');
  } catch (err) {
    response.error(res, 'Channel discovery failure.');
  }
});

/**
 * @route   GET /api/chats/:id
 * @desc    Establish dedicated data link for specific channel
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email role phone')
      .populate({
          path: 'appointmentId',
          populate: { path: 'propertyId', select: 'name address images price' }
      });

    if (!chat) return response.error(res, 'Channel node not found.', 404);

    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return response.error(res, 'Security breach: Identity not part of this channel.', 403);
    }

    response.success(res, chat, 'Channel data stream active.');
  } catch (err) {
    response.error(res, 'Channel handshake failure.');
  }
});

/**
 * @route   POST /api/chats/:id/messages
 * @desc    Transmit message across secure channel
 */
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return response.error(res, 'Message payload empty.', 400);

    const chat = await Chat.findById(req.params.id);
    if (!chat) return response.error(res, 'Channel node not found.', 404);

    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return response.error(res, 'Security breach: Unauthorized transmission attempt.', 403);
    }

    const newMessage = { senderId: req.user.id, text, timestamp: new Date() };
    chat.messages.push(newMessage);
    chat.updatedAt = new Date(); // Force update for sorting
    await chat.save();

    response.success(res, newMessage, 'Message transmitted successfully.', 201);
  } catch (err) {
    response.error(res, 'Transmission node failure.');
  }
});

module.exports = router;
