const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is missing; starting in demo in-memory mode.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 8000,
    });
    console.log('MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.warn(`MongoDB unavailable (${err.message}); starting in demo in-memory mode.`);
    return false;
  }
};

module.exports = connectDB;
