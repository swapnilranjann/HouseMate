const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');

// Create a new support ticket
router.post('/', auth, async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required.' });
    }

    const ticket = new SupportTicket({
      user: req.user.id,
      subject,
      description,
      priority: priority || 'Normal'
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Support ticket error:', error);
    res.status(500).json({ message: 'Server error processing ticket' });
  }
});

// Get user's tickets
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
});

module.exports = router;
