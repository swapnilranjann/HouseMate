const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // Removed global unique: true
  phone: { type: String, required: true }, // Added phone number
  password: { type: String, required: true },
  role: { type: String, enum: ['tenant', 'customer'], required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
}, { timestamps: true });

// Add composite index to allow same email for different roles, but NOT within same role
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
