const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Route
router.get('/profile', auth, (req, res) => {
    res.json({
        message: "This is protected data",
        userId: req.user
    });
});

module.exports = router;