const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI is missing');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    console.log('Connection state:', conn.connection.readyState);
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'MongoNetworkError') {
      console.error('Network error - Please check your internet connection and MongoDB Atlas network access settings');
    }
    
    if (error.name === 'MongoParseError') {
      console.error('Connection string parse error - Please check your MongoDB URI format');
    }
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Server selection error - Please check if MongoDB Atlas cluster is running and accessible');
    }
    
    throw error; // Re-throw to be caught by the server.js error handler
  }
};

module.exports = connectDB; 