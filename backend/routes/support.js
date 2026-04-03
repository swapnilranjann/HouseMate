const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');
const response = require('../utils/response');

/**
 * @route   POST /api/support
 * @desc    Initialize support ticket sequence
 */
router.post('/', auth, async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    
    if (!subject || !description) {
      return response.error(res, 'Identity verification: Subject and description required.', 400);
    }

    const ticket = new SupportTicket({
      user: req.user.id,
      subject,
      description,
      priority: priority || 'Normal'
    });

    await ticket.save();
    response.success(res, ticket, 'Support ticket initialized successfully.', 201);
  } catch (err) {
    console.error('Support ticket error:', err.stack);
    response.error(res, 'Support node sequence failure.');
  }
});

/**
 * @route   GET /api/support/my-tickets
 * @desc    Retrieve all tickets for current identity
 */
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    response.success(res, tickets, 'Identity support tickets synchronised.');
  } catch (err) {
    response.error(res, 'Ticket retrieval handshake failure.');
  }
});

module.exports = router;
