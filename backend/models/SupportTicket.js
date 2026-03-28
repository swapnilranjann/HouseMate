const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    enum: ['Bug Report', 'Scam Property', 'Account Access', 'Billing Issue', 'General Question', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Critical'],
    default: 'Normal'
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
