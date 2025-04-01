const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/teacher', teacherRoutes);

// Test route in main app
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'your_mongodb_connection_string')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ... rest of your app configuration

module.exports = app; 