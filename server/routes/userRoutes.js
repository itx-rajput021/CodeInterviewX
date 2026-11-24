const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/User');
const demoStore = require('../config/demoStore');

// Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Route
router.get('/profile', auth, async (req, res) => {
    let user;
    if (mongoose.connection.readyState === 1) {
        user = await User.findById(req.user.userId).select('-password').catch(() => null);
    } else {
        user = demoStore.users.find((item) => item.id === req.user.userId);
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    const plain = user.toObject ? user.toObject() : { ...user };
    return res.json({
        message: 'Profile loaded',
        user: { id: String(plain._id || plain.id), name: plain.name, email: plain.email, role: plain.role }
    });
});

module.exports = router;