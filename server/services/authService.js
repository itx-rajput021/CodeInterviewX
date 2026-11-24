const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const demoStore = require('../config/demoStore');

const isMongoReady = () => mongoose.connection.readyState === 1;

const normalizeRole = (role) => role === 'interviewer' ? 'interviewer' : 'candidate';

const createSession = (user) => {
    const token = jwt.sign(
        { userId: String(user.id), role: normalizeRole(user.role), name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        message: 'Authentication successful!',
        token,
        user: {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: normalizeRole(user.role)
        }
    };
};

const signupService = async ({ name, email, password, role }) => {
    if (!name?.trim() || !email?.trim() || !password) {
        throw new Error('Name, email and password are required');
    }
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!isMongoReady()) {
        const existingUser = demoStore.users.find((item) => item.email === normalizedEmail);
        if (existingUser) throw new Error('User already exists');

        const newUser = {
            id: demoStore.createId(),
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: normalizeRole(role)
        };
        demoStore.users.push(newUser);
        return createSession(newUser);
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) throw new Error('User already exists');

    const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: normalizeRole(role)
    });

    return createSession({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    });
};

const loginService = async ({ email, password }) => {
    if (!email?.trim() || !password) {
        throw new Error('Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user;

    if (!isMongoReady()) {
        user = demoStore.users.find((item) => item.email === normalizedEmail);
    } else {
        user = await User.findOne({ email: normalizedEmail });
    }

    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    return createSession({
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });
};


module.exports = {
    signupService,
    loginService
};