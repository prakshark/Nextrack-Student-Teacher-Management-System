const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Verify token route
router.get('/verify', auth, verifyToken);

// Debug route - list all users
router.get('/debug/users', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    const teachers = await Teacher.find().select('-password');
    res.json({
      students,
      teachers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 