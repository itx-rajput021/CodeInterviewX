require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 
const userRoutes = require('./routes/userRoutes'); // 1. IMPORT YOUR ROUTES
const auth = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cors()); // 2. ENABLE CORS MIDDLEWARE
app.get('/test', (req, res) => res.send('Server is working!'));
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

// 3. DATABASE CONNECTION AND START SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Connection failed:", err));

  console.log("JWT Secret Loaded:", process.env.JWT_SECRET);