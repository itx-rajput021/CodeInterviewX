const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/signup', async (req, res) => {
    try {
        const { name, fullName, email, password } = req.body;
        const userName = name || fullName;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: userName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully!",
            token
        });

    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});
//login page
router.post('/login', async(req, res)=>{
    try{
        const { email, password } = req.body;
       
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"invalid Email or password"});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid password please try again!"})
        // generating tokens
       const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        // 3. Send the token back to the user
        res.status(200).json({ 
            message: "Login successful!", 
            token: token 
        });


    }catch(error){
        res.status(500).json({error:error.message});
    }
})
//only users with a valid token can access it
router.get('/profile', auth, async(req, res) => {
    // req.user mein aapki ID maujood hai
    res.json({ 
        message: "This is protected data", 
        userId: req.user 
    });
});
module.exports = router;