const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Get All Chats for Current User (Only with approved/rejected status filtering)
router.get('/', auth, async (req, res) => {
  try {
    const filter = { participants: req.user.id };
    const chats = await Chat.find(filter)
      .populate('appointmentId')
      .populate('participants', 'name email role');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Specific Chat Data
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email')
      .populate('appointmentId');

    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Message (HTTP Alternative or for initial saving)
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    chat.messages.push({ senderId: req.user.id, text });
    await chat.save();
    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
