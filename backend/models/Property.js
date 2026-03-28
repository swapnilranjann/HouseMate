const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  listerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ['House', 'Flat', 'Office', 'Shop', 'Villa', 'Other'], default: 'House' },
  floor: { type: String, required: true },
  bhk: { type: String, required: true },
  dimensions: { type: String },
  roadInfo: { type: String },
  images: [{ type: String }],
  status: { type: String, enum: ['open', 'booked'], default: 'open' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
