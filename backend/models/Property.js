const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  listerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  price: { type: Number, required: true, default: 0 }, // Added missing price field
  address: { type: String, required: true },
  type: { type: String, enum: ['House', 'Flat', 'Office', 'Shop', 'Villa', 'Other'], default: 'House' },
  floor: { type: String, required: true },
  bhk: { type: String, required: true },
  dimensions: { type: String },
  roadInfo: { type: String },
  images: [{ type: String }],
  status: { type: String, enum: ['open', 'booked'], default: 'open' },
  views: { type: Number, default: 0 },
  locationLink: { type: String, required: true },
}, { timestamps: true });

// Indexing for search performance
propertySchema.index({ address: 'text', name: 'text' });
propertySchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);
