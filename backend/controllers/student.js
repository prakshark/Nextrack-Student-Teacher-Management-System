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

    // Remove password from response
    student.password = undefined;

    res.status(200).json({
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
    console.log('Backend - Updating profile with data:', req.body);
    console.log('Backend - GitHub username in request:', req.body.githubUsername);
    console.log('Backend - Required fields check:', {
      leetcodeUsername: req.body.leetcodeUsername,
      codechefUsername: req.body.codechefUsername,
      phone: req.body.phone
    });

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

    console.log('Backend - Updated student profile:', {
      id: student._id,
      githubUsername: student.githubUsername
    });

    // Return the same user object structure as auth endpoints
    const responseData = {
      id: student._id,
      name: student.name,
      email: student.email,
      userType: 'student',
      leetcodeUsername: student.leetcodeUsername,
      codechefUsername: student.codechefUsername,
      githubUsername: student.githubUsername
    };
    console.log('Backend - Sending response data:', responseData);
    console.log('Backend - GitHub username in response:', responseData.githubUsername);

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Backend - Error updating profile:', error);
    console.error('Backend - Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
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
      data: student.rankings,
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

// @desc    Toggle assignment completion status
// @route   POST /api/student/assignments/:id/toggle-completion
// @access  Private
exports.toggleCompletion = async (req, res) => {
  try {
    const { isCompleted } = req.body;
    const assignmentId = req.params.id;
    const studentId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Update completedBy array
    if (isCompleted) {
      if (!assignment.completedBy.includes(studentId)) {
        assignment.completedBy.push(studentId);
      }
    } else {
      assignment.completedBy = assignment.completedBy.filter(id => id.toString() !== studentId);
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error in toggleCompletion:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating completion status'
    });
  }
}; 