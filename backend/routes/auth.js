const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Allow multiple accounts with same email IF roles are different
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: `User already exists as a ${role}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email AND role to allow same email for different personas
    const query = role ? { email, role } : { email };
    const user = await User.findOne(query);
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials or role' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, favorites: user.favorites } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simulated Forgot Password (In production, would send an email with reset token)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email' });
        
        // Simulation: In a real app we generate a JWT reset token here
        res.json({ message: 'Password reset link sent to your email (simulated)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
