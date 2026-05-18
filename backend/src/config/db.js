const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`✅ Note: MongoDB connection skipped. Using in-memory mock database for auth.`);
    // const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Not exiting so the mock can run
  }
};

module.exports = connectDB;
