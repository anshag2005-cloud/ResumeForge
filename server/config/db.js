const mongoose = require('mongoose');

const connectDB = async () => {
  global.dbMode = 'mongo';
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resumeforge';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Timeout in 2 seconds to trigger fast mock fallback
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.warn("-----------------------------------------------------------------");
    console.warn("WARNING: MongoDB is not running locally. Entering In-Memory Mock Mode!");
    console.warn("-----------------------------------------------------------------");
    global.dbMode = 'mock';
    
    // Initialize in-memory arrays to simulate MongoDB collections
    global.mockDB = {
      users: [],
      resumes: [],
      analyses: [],
      jobDescriptions: [],
      jobMatches: [],
      coverLetters: [],
      applications: []
    };
  }
};

module.exports = connectDB;
