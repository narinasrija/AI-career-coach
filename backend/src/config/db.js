const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('localhost') && process.env.SKIP_LOCAL_DB === 'true') {
      console.log(`⚠️ Warning: MONGO_URI is not defined or skipped. Falling back to in-memory mock database.`);
      delete process.env.MONGO_URI; // Ensure controllers use mock
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`⚠️ Fallback: Proceeding with in-memory database mock.`);
    delete process.env.MONGO_URI; // Fall back to mock in controllers
  }
};

module.exports = connectDB;
