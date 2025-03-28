const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const axios = require('axios');

// @desc    Register student
// @route   POST /api/student/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      leetcodeUsername,
      codechefUsername,
      githubUsername,
      linkedinProfileUrl
    } = req.body;

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      phone,
      leetcodeUsername,
      codechefUsername,
      githubUsername,
      linkedinProfileUrl
    });

    // Create token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        userType: 'student',
        leetcodeUsername: student.leetcodeUsername,
        codechefUsername: student.codechefUsername,
        githubUsername: student.githubUsername
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login student
// @route   POST /api/student/login
// @access  Public
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for student
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile with data:', req.body);
    const student = await Student.findByIdAndUpdate(
      req.user.userId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    console.log('Updated student profile:', {
      id: student._id,
      githubUsername: student.githubUsername
    });

    // Return the same user object structure as auth endpoints
    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        userType: 'student',
        leetcodeUsername: student.leetcodeUsername,
        codechefUsername: student.codechefUsername,
        githubUsername: student.githubUsername
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student assignments
// @route   GET /api/student/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      assignedTo: req.user.userId
    });

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student rankings
// @route   GET /api/student/rankings
// @access  Private
exports.getRankings = async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Fetch Leetcode data
    const leetcodeResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${student.leetcodeUsername}`);
    
    // Fetch Codechef data
    const codechefResponse = await axios.get(`https://codechef-api.vercel.app/${student.codechefUsername}`);
    
    // Fetch GitHub data
    const githubResponse = await axios.get(`https://api.github.com/users/${student.githubUsername}`);

    // Update rankings
    student.rankings = {
      leetcode: leetcodeResponse.data,
      codechef: codechefResponse.data,
      github: githubResponse.data
    };

    await student.save();

    res.status(200).json({
      success: true,
      data: student.rankings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 