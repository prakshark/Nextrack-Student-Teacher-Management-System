const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const axios = require('axios');
const Attendance = require('../models/Attendance');

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
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    const { name, description, deadline, links, difficulty } = req.body;

    // Validate links array
    if (!Array.isArray(links) || links.length === 0) {
      console.log('Invalid links array:', links);
      return res.status(400).json({
        success: false,
        message: 'Links must be an array with at least one link'
      });
    }

    // Ensure all links are strings and not empty
    const validLinks = links.filter(link => typeof link === 'string' && link.trim() !== '');
    if (validLinks.length === 0) {
      console.log('No valid links found after filtering');
      return res.status(400).json({
        success: false,
        message: 'At least one valid link is required'
      });
    }

    // Get all students first
    const students = await Student.find();
    console.log('Found students:', students.length);
    console.log('Student details:', students.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email
    })));

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No students found to assign the assignment to'
      });
    }

    // Create assignment with all students assigned
    const assignmentData = {
      name: name.trim(),
      description: description.trim(),
      deadline: new Date(deadline),
      links: validLinks,
      difficulty: difficulty,
      assignedTo: students.map(student => student._id)
    };

    console.log('Creating assignment with data:', assignmentData);

    const assignment = await Assignment.create(assignmentData);
    console.log('Assignment created successfully:', JSON.stringify(assignment, null, 2));

    // Verify the assignment was created correctly
    const createdAssignment = await Assignment.findById(assignment._id)
      .populate('assignedTo', 'name email');
    console.log('Verified assignment:', JSON.stringify(createdAssignment, null, 2));

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error in assignAssignment:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors
    });
    
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

// @desc    Get all assignments
// @route   GET /api/teacher/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    console.log('Fetching all assignments');
    const assignments = await Assignment.find()
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('Found assignments:', assignments.length);
    
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Error in getAssignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments'
    });
  }
};

// @desc    Get specific assignment by ID
// @route   GET /api/teacher/assignments/:assignmentId
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get assignment completion status for all students
// @route   GET /api/teacher/assignment-status/:assignmentId
// @access  Private
exports.getAssignmentStatus = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    
    // Get all students
    const students = await Student.find().select('name email completedAssignments');
    
    // Separate students into completed and not completed
    const completedStudents = [];
    const notCompletedStudents = [];

    for (const student of students) {
      const completedAssignment = student.completedAssignments.find(
        ca => ca.assignment.toString() === assignmentId
      );

      if (completedAssignment) {
        completedStudents.push({
          _id: student._id,
          name: student.name,
          email: student.email,
          completedAt: completedAssignment.completedAt
        });
      } else {
        notCompletedStudents.push({
          _id: student._id,
          name: student.name,
          email: student.email
        });
      }
    }

    res.json({
      success: true,
      data: {
        completed: completedStudents,
        notCompleted: notCompletedStudents
      }
    });
  } catch (error) {
    console.error('Error in getAssignmentStatus:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student performance data
// @route   GET /api/teacher/student-performance
// @access  Private
exports.getStudentPerformance = async (req, res) => {
  try {
    // Get all students with their profile data
    const students = await Student.find().select('name email leetcodeProfileUrl codechefProfileUrl githubProfileUrl rankings completedAssignments');

    // For each student, calculate the number of completed assignments by difficulty
    const studentsWithStats = await Promise.all(students.map(async (student) => {
      // Get all assignments completed by the student
      const assignments = await Assignment.find({
        _id: { $in: student.completedAssignments.map(ca => ca.assignment) }
      });

      // Count assignments by difficulty
      const completedByDifficulty = {
        easy: 0,
        medium: 0,
        hard: 0
      };

      assignments.forEach(assignment => {
        completedByDifficulty[assignment.difficulty.toLowerCase()]++;
      });

      // Return student data with assignment counts
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        leetcodeProfileUrl: student.leetcodeProfileUrl,
        codechefProfileUrl: student.codechefProfileUrl,
        githubProfileUrl: student.githubProfileUrl,
        rankings: student.rankings,
        completedAssignments: completedByDifficulty
      };
    }));

    res.json({
      success: true,
      data: studentsWithStats
    });
  } catch (error) {
    console.error('Error in getStudentPerformance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/teacher/students
// @access  Private
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance for all students
// @route   GET /api/teacher/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    // Get attendance records for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // Set time to noon to avoid timezone issues
    thirtyDaysAgo.setHours(12, 0, 0, 0);

    const attendanceRecords = await Attendance.find({
      date: { $gte: thirtyDaysAgo }
    }).populate('student', 'name email');

    // Transform the data into the format expected by the frontend
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      if (!attendanceMap[record.student._id]) {
        attendanceMap[record.student._id] = {};
      }
      // Format date as YYYY-MM-DD
      const dateStr = record.date.toISOString().split('T')[0];
      attendanceMap[record.student._id][dateStr] = record.present;
    });

    res.json({
      success: true,
      data: attendanceMap
    });
  } catch (error) {
    console.error('Error in getAttendance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark attendance for a student
// @route   POST /api/teacher/attendance
// @access  Private
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, present } = req.body;

    // Validate inputs
    if (!studentId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both studentId and date'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Parse the date and set time to noon to avoid timezone issues
    const attendanceDate = new Date(date);
    attendanceDate.setHours(12, 0, 0, 0);

    // Check if date is not in the future
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    if (attendanceDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for future dates'
      });
    }

    // Update or create attendance record
    await Attendance.findOneAndUpdate(
      {
        student: studentId,
        date: attendanceDate
      },
      {
        student: studentId,
        date: attendanceDate,
        present: present,
        markedBy: req.user.id
      },
      {
        upsert: true,
        new: true
      }
    );

    // Fetch updated attendance data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(12, 0, 0, 0);

    const attendanceRecords = await Attendance.find({
      date: { $gte: thirtyDaysAgo }
    }).populate('student', 'name email');

    // Transform the data
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      if (!attendanceMap[record.student._id]) {
        attendanceMap[record.student._id] = {};
      }
      const dateStr = record.date.toISOString().split('T')[0];
      attendanceMap[record.student._id][dateStr] = record.present;
    });

    res.json({
      success: true,
      data: attendanceMap
    });
  } catch (error) {
    console.error('Error in markAttendance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 