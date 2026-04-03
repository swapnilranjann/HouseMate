const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const response = require('../utils/response');

// Helper to standardise user data transmission
const getSafeUserData = (user) => ({
    id: user._id, 
    name: user.name, 
    email: user.email, 
    phone: user.phone, 
    role: user.role, 
    favorites: user.favorites || []
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // Identity verification checks
    if (!name || !email || !phone || !password || !role) {
      return response.error(res, 'Please complete all required identity fields.', 400);
    }

    if (password.length < 8) {
      return response.error(res, 'Security requirement: Password must be at least 8 characters.', 400);
    }

    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return response.error(res, `An account already exists for this ${role} profile.`, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Slightly higher rounds for registration
    const user = new User({ name, email, phone, password: hashedPassword, role });
    await user.save();

    response.success(res, null, 'Account registered successfully! Welcome to HouseMate.', 201);
  } catch (err) {
    console.error('Registration Error:', err.stack);
    response.error(res, 'Internal registration pipeline failure.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Strict Input Validation
    if (!email || !password) {
        return response.error(res, 'Identity credentials (email/password) required.', 400);
    }

    const query = role ? { email, role } : { email };
    const user = await User.findOne(query).select('+password');
    
    if (!user) return response.error(res, 'Identity verification failed. Invalid credentials.', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return response.error(res, 'Security mismatch. Access denied.', 401);

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '10d' }
    );

    response.success(res, { 
        token, 
        user: getSafeUserData(user) 
    }, 'Security handshake successful! Session node active.');
  } catch (err) {
    console.error('Login Error:', err.stack);
    response.error(res, 'Internal authentication node failure.');
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return response.error(res, 'Identity profile not found.', 404);
    
    response.success(res, getSafeUserData(user), 'Identity synchronised successfully.');
  } catch (err) {
    console.error('Profile Fetch Error:', err.stack);
    response.error(res, 'Profile identification failure.');
  }
});

router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return response.error(res, 'Identity profile not found.', 404);

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    response.success(res, getSafeUserData(user), 'Profile synchronised successfully.');
  } catch (err) {
    console.error('Profile Update Error:', err.stack);
    response.error(res, 'Profile update synchronisation failure.');
  }
});

router.put('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
        return response.error(res, 'Current and new security keys are required.', 400);
    }

    if (newPassword.length < 8) {
        return response.error(res, 'New security key fails complexity node. 8+ characters required.', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return response.error(res, 'Access denied. Identity profile unknown.', 401);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return response.error(res, 'Current security key mismatch.', 401);

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    
    response.success(res, null, 'Security key updated across all nodes successfully.');
  } catch (err) {
      console.error('Password Change Error:', err.stack);
    response.error(res, 'Security update failure.');
  }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return response.error(res, 'Identity email target required.', 400);

        const user = await User.findOne({ email });
        // Standard security practice: Don't leak whether user exists
        response.success(res, null, 'If that identity exists, a reset node link has been transmitted.');
    } catch (err) {
        response.error(res, 'Security transmission failure.');
    }
});

module.exports = router;
