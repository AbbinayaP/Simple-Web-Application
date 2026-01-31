const mongoose = require('mongoose');

let cachedMs = null;

async function connectToDatabase() {
  if (cachedMs) {
    return cachedMs;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const opts = {
    bufferCommands: false,
  };

  try {
      const db = await mongoose.connect(MONGODB_URI, opts);
      cachedMs = db;
      return db;
  } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
  }
}

module.exports = connectToDatabase;
