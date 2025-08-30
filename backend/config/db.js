const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // --- DEBUGGING LINE ---
    console.log('Attempting to connect to MONGO_URI:', process.env.MONGO_URI ? '****** (password hidden)' : 'undefined or empty');
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set in environment variables!');
        process.exit(1); // Exit if essential variable is missing
    }
    // --- END DEBUGGING LINE ---

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;