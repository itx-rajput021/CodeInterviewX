const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signupService = async ({ name, email, password, role }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
    });

    // Save user
    await newUser.save();

    // Generate token
    const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Return response
    return {
    message:"User registered successfully!",
    token,

    user:{
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
}
}
};

const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        message: "Login successful!",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


module.exports = {
    signupService,
    loginService
};