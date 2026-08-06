process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Test Route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

// Pehle Database connect hoga, phir server start hoga
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server due to Database connection error:", err.message);
});