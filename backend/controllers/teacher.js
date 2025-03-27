const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const axios = require('axios');

// @desc    Register teacher
// @route   POST /api/teacher/register
// @access  Public
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Create teacher
    const teacher = await Teacher.create({
      name,
      email,
      password,
      phone
    });

    // Create token
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
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

// @desc    Login teacher
// @route   POST /api/teacher/login
// @access  Public
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for teacher
    const teacher = await Teacher.findOne({ email }).select('+password');
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await teacher.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
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

// @desc    Assign assignment to students
// @route   POST /api/teacher/assignments
// @access  Private
exports.assignAssignment = async (req, res) => {
  try {
    const { name, link, deadline, studentIds } = req.body;

    // Create assignment
    const assignment = await Assignment.create({
      name,
      link,
      deadline,
      assignedTo: studentIds
    });

    // Update teacher's assigned assignments
    await Teacher.findByIdAndUpdate(req.user.userId, {
      $push: { assignedAssignments: assignment._id }
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all student rankings
// @route   GET /api/teacher/rankings
// @access  Private
exports.getRankings = async (req, res) => {
  try {
    const students = await Student.find().select('name rankings');
    
    // Fetch latest data for each student
    for (let student of students) {
      try {
        // Fetch Leetcode data
        const leetcodeUsername = student.leetcodeProfileUrl.split('/').pop();
        const leetcodeResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}`);
        
        // Fetch Codechef data
        const codechefUsername = student.codechefProfileUrl.split('/').pop();
        const codechefResponse = await axios.get(`https://codechef-api.vercel.app/${codechefUsername}`);
        
        // Fetch GitHub data
        const githubUsername = student.githubProfileUrl.split('/').pop();
        const githubResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);

        // Update rankings
        student.rankings = {
          leetcode: leetcodeResponse.data,
          codechef: codechefResponse.data,
          github: githubResponse.data
        };

        await student.save();
      } catch (error) {
        console.error(`Error fetching data for student ${student.name}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      data: students.map(student => ({
        name: student.name,
        rankings: student.rankings
      }))
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get assignment completion status
// @route   GET /api/teacher/assignment-completion
// @access  Private
exports.getAssignmentCompletion = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');

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

// @desc    Get student details
// @route   GET /api/teacher/student-details
// @access  Private
exports.getStudentDetails = async (req, res) => {
  try {
    const students = await Student.find().select('-password');

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 