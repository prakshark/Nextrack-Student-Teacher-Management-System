const express = require('express');
const router = express.Router();
const { register, login, verifyToken, debugUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Verify token route
router.get('/verify', auth, verifyToken);

// Debug routes
router.get('/debug/user', debugUser);

// Direct delete route for debugging
router.get('/delete-user', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Attempting to delete user:', email);

    // Try to delete from both collections
    const deletedStudent = await Student.findOneAndDelete({ email });
    const deletedTeacher = await Teacher.findOneAndDelete({ email });

    if (deletedStudent) {
      console.log('Deleted student:', deletedStudent._id);
    }
    if (deletedTeacher) {
      console.log('Deleted teacher:', deletedTeacher._id);
    }

    if (!deletedStudent && !deletedTeacher) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        student: deletedStudent ? { id: deletedStudent._id, email: deletedStudent.email } : null,
        teacher: deletedTeacher ? { id: deletedTeacher._id, email: deletedTeacher.email } : null
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
});

router.get('/debug/users', async (req, res) => {
  try {
    const students = await Student.find().select('+password');
    const teachers = await Teacher.find().select('+password');
    res.json({
      success: true,
      data: {
        students: students.map(student => ({
          ...student.toObject(),
          password: student.password ? 'Password exists' : 'No password'
        })),
        teachers: teachers.map(teacher => ({
          ...teacher.toObject(),
          password: teacher.password ? 'Password exists' : 'No password'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Temporary route to reset password for testing
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log('Resetting password for:', { email, userType });

    const UserModel = userType === 'student' ? Student : Teacher;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Set new password
    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

module.exports = router; 