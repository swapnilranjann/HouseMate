const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const response = require('../utils/response');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return response.error(res, 'Please complete all required identity fields.', 400);
    }

    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return response.error(res, `An account already exists for this ${role} profile.`, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, role });
    await user.save();

    response.success(res, null, 'Account registered successfully! Welcome to HouseMate.', 201);
  } catch (err) {
    console.error('Registration Error:', err.message);
    response.error(res, 'Internal registration pipeline failure.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const query = role ? { email, role } : { email };
    const user = await User.findOne(query).select('+password');
    
    if (!user) return response.error(res, 'Invalid identity credentials or role.', 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return response.error(res, 'Invalid security credentials.', 400);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '10d' });
    const userData = { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role, 
        favorites: user.favorites 
    };

    response.success(res, { token, user: userData }, 'Authentication successful! Session established.');
  } catch (err) {
    console.error('Login Error:', err.message);
    response.error(res, 'Internal authentication node failure.');
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
    response.success(res, user, 'Profile synchronised successfully.');
  } catch (err) {
    response.error(res, 'Profile update synchronisation failure.');
  }
});

router.put('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return response.error(res, 'Incorrect current security key.', 400);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    response.success(res, null, 'Security key updated successfully.');
  } catch (err) {
    response.error(res, 'Security update failure.');
  }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return response.error(res, 'No account found with this identity email.', 404);
        
        response.success(res, null, 'Security reset link transmitted to your email.');
    } catch (err) {
        response.error(res, 'Security transmission failure.');
    }
});

module.exports = router;
