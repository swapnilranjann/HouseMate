const express = require('express');
const router = express.Router();
const multer = require('multer');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Property (Tenant Only)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'tenant') return res.status(403).json({ message: 'Only tenants can upload properties' });

    const property = new Property({
      ...req.body,
      listerId: req.user.id,
      images: req.files.map(f => `/uploads/${f.filename}`),
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({}).populate('listerId', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Property Status (Tenant Only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property.listerId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    property.status = req.body.status;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment View Count
router.post('/:id/view', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Favorite / Bookmark Logic
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.id)) {
      user.favorites.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Property added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
