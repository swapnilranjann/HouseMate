const express = require('express');
const router = express.Router();
const multer = require('multer');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');
const response = require('../utils/response');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/properties
 * @desc    Upload Property (Tenant Only)
 */
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'tenant') {
        return response.error(res, 'Security restriction: Only property owners can register assets.', 403);
    }

    const { name, type, price, location, description, beds, baths, sqft } = req.body;
    
    if (!name || !type || !price || !location) {
        return response.error(res, 'Missing required asset specifications.', 400);
    }

    const property = new Property({
      ...req.body,
      listerId: req.user.id,
      images: req.files ? req.files.map(f => `/uploads/${f.filename}`) : [],
    });
    
    await property.save();
    response.success(res, property, 'Exclusive property asset registered successfully.', 201);
  } catch (err) {
    console.error('Property creation error:', err.stack);
    response.error(res, 'Property registration pipeline failure.');
  }
});

/**
 * @route   GET /api/properties
 * @desc    Fetch All Properties (with filtering)
 */
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type && type !== 'All' ? { type } : {};
    
    const properties = await Property.find(query).populate('listerId', 'name email phone');
    response.success(res, properties, 'Property inventory synchronised.');
  } catch (err) {
    response.error(res, 'Property retrieval handshake failure.');
  }
});

/**
 * @route   GET /api/properties/:id
 * @desc    Fetch Single Property (Highly Efficient)
 */
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('listerId', 'name email phone');
        if (!property) return response.error(res, 'Asset not found in existing nodes.', 404);
        
        response.success(res, property, 'Asset details synchronised.');
    } catch (err) {
        response.error(res, 'Asset identification failure.');
    }
});

/**
 * @route   PUT /api/properties/:id/status
 * @desc    Update Property Status (Tenant Only)
 */
router.put('/:id/status', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return response.error(res, 'Property node not found.', 404);
    
    if (property.listerId.toString() !== req.user.id) {
        return response.error(res, 'Security breach: Critical lack of node authority.', 403);
    }

    property.status = req.body.status;
    await property.save();
    response.success(res, property, 'Property status updated across all nodes.');
  } catch (err) {
    response.error(res, 'Status synchronisation failure.');
  }
});

/**
 * @route   POST /api/properties/:id/view
 * @desc    Increment Analytics View Count
 */
router.post('/:id/view', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    response.success(res, property, 'Analytics node incremented.');
  } catch (err) {
    response.error(res, 'Analytics synchronisation failure.');
  }
});

/**
 * @route   POST /api/properties/:id/favorite
 * @desc    Update Security Identity Favorites
 */
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return response.error(res, 'Identity node not found.', 404);

    const isFavorited = user.favorites.includes(req.params.id);
    
    if (isFavorited) {
        user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    } else {
        user.favorites.push(req.params.id);
    }
    
    await user.save();
    response.success(res, { isFavorited: !isFavorited, favorites: user.favorites }, 'Identity favorites synchronised.');
  } catch (err) {
    response.error(res, 'Favorite node synchronisation failure.');
  }
});

module.exports = router;
