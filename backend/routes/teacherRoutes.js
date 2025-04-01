const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');
const axios = require('axios');
const Submission = require('../models/Submission');

// Add this console log to verify route registration
console.log('Registering teacher routes...');

// Debug route to test if routes are registered
router.get('/test', (req, res) => {
  res.json({ message: 'Teacher routes are working' });
});

// Get all assignments
router.get('/assignments', [auth, teacherAuth], async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ deadline: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignments' });
  }
});

// Get single assignment
router.get('/assignments/:id', [auth, teacherAuth], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignment' });
  }
});

// Create new assignment
router.post('/assignments', [auth, teacherAuth], async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, message: 'Error creating assignment' });
  }
});

// Get assignment status
router.get('/assignment-status/:id', [auth, teacherAuth], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const students = await Student.find();
    const completedStudents = [];
    const notCompletedStudents = [];

    for (const student of students) {
      const isCompleted = student.completedAssignments?.includes(assignment._id);
      if (isCompleted) {
        completedStudents.push({
          _id: student._id,
          name: student.name,
          email: student.email,
          completedAt: student.assignmentCompletionDates?.[assignment._id]
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
    console.error('Error fetching assignment status:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignment status' });
  }
});

// Get all students
router.get('/students', [auth, teacherAuth], async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
});

// Get student details
router.get('/student-details', [auth, teacherAuth], async (req, res) => {
  try {
    // Get all students
    const students = await Student.find().select('-password');
    
    // Get all assignments sorted by upload date (newest first)
    const assignments = await Assignment.find()
      .sort({ uploadDate: -1 })
      .select('title description difficulty uploadDate deadline');

    // Get LeetCode stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        if (student.leetcodeUsername) {
          try {
            const statsResponse = await axios.get(`http://localhost:5000/api/student/rankings/${student._id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return {
              ...student.toObject(),
              leetcodeStats: statsResponse.data.data.leetcode
            };
          } catch (err) {
            console.error(`Error fetching LeetCode stats for ${student.name}:`, err);
            return {
              ...student.toObject(),
              leetcodeStats: null
            };
          }
        }
        return student.toObject();
      })
    );

    res.json({ 
      success: true, 
      data: {
        students: studentsWithStats,
        assignments
      }
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ success: false, message: 'Error fetching student details' });
  }
});

// Get student performance data
router.get('/student-performance', [auth, teacherAuth], async (req, res) => {
  try {
    // Get all students with their rankings
    const students = await Student.find().select('name email rankings');
    
    // Get all assignments
    const assignments = await Assignment.find().select('difficulty');
    
    // Get all submissions
    const submissions = await Submission.find().select('studentId assignmentId status');
    
    // Calculate completed assignments by difficulty for each student
    const studentsWithPerformance = students.map(student => {
      // Get all submissions for this student
      const studentSubmissions = submissions.filter(sub => 
        sub.studentId.toString() === student._id.toString() && 
        sub.status === 'completed'
      );
      
      // Get the assignment difficulties for completed submissions
      const completedDifficulties = studentSubmissions.map(sub => {
        const assignment = assignments.find(a => a._id.toString() === sub.assignmentId.toString());
        return assignment?.difficulty?.toLowerCase();
      }).filter(Boolean);
      
      // Count completed assignments by difficulty
      const completedAssignments = {
        easy: completedDifficulties.filter(d => d === 'easy').length,
        medium: completedDifficulties.filter(d => d === 'medium').length,
        hard: completedDifficulties.filter(d => d === 'hard').length
      };
      
      return {
        ...student.toObject(),
        completedAssignments
      };
    });

    res.json({
      success: true,
      data: studentsWithPerformance
    });
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student performance data'
    });
  }
});

// Get attendance
router.get('/attendance', [auth, teacherAuth], async (req, res) => {
  try {
    const attendance = await Attendance.find();
    const attendanceMap = {};
    
    attendance.forEach(record => {
      if (!attendanceMap[record.student.toString()]) {
        attendanceMap[record.student.toString()] = {};
      }
      attendanceMap[record.student.toString()][record.date.toISOString().split('T')[0]] = record.present;
    });

    res.json({ success: true, data: attendanceMap });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
});

// Update attendance
router.post('/attendance', [auth, teacherAuth], async (req, res) => {
  try {
    console.log('=== Starting attendance update ===');
    console.log('Request body:', req.body);
    console.log('Teacher ID:', req.user._id);

    // Validate request body
    if (!req.body.student || !req.body.date || typeof req.body.present !== 'boolean') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: student, date, and present are required'
      });
    }

    const { student, date, present } = req.body;
    console.log('Extracted data:', { student, date, present });
    
    // Validate student exists
    console.log('Checking if student exists...');
    const studentExists = await Student.findById(student);
    console.log('Student exists:', !!studentExists);
    
    if (!studentExists) {
      console.log('Student not found:', student);
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Convert date string to Date object
    console.log('Converting date...');
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      console.error('Invalid date:', date);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Ensure we're working with the correct year (2025)
    if (attendanceDate.getFullYear() !== 2025) {
      attendanceDate.setFullYear(2025);
    }
    
    // Set time to noon to avoid timezone issues
    attendanceDate.setHours(12, 0, 0, 0);
    console.log('Converted date:', attendanceDate);

    // Find existing attendance record
    console.log('Looking for existing attendance record...');
    let attendance;
    try {
      attendance = await Attendance.findOne({ 
        student: student,
        date: attendanceDate
      });
      console.log('Existing attendance record:', attendance);
    } catch (findError) {
      console.error('Error finding attendance record:', findError);
      throw findError;
    }

    if (attendance) {
      console.log('Updating existing attendance record...');
      attendance.present = present;
      try {
        await attendance.save();
        console.log('Updated attendance record:', attendance);
      } catch (saveError) {
        console.error('Error saving attendance record:', saveError);
        throw saveError;
      }
    } else {
      console.log('Creating new attendance record...');
      try {
        const newAttendance = new Attendance({ 
          student: student,
          date: attendanceDate,
          present: present,
          markedBy: req.user._id
        });
        console.log('New attendance object:', newAttendance);
        attendance = await newAttendance.save();
        console.log('Created new attendance record:', attendance);
      } catch (createError) {
        console.error('Error creating attendance record:', createError);
        if (createError.code === 11000) {
          console.error('Duplicate key error:', createError);
          return res.status(409).json({
            success: false,
            message: 'Duplicate attendance record'
          });
        }
        throw createError;
      }
    }

    // Fetch updated attendance map
    console.log('Fetching all attendance records...');
    const allAttendance = await Attendance.find();
    console.log('Total attendance records:', allAttendance.length);
    
    const attendanceMap = {};
    allAttendance.forEach(record => {
      const studentId = record.student.toString();
      const dateStr = record.date.toISOString().split('T')[0];
      
      if (!attendanceMap[studentId]) {
        attendanceMap[studentId] = {};
      }
      attendanceMap[studentId][dateStr] = record.present;
    });

    console.log('Final attendance map:', attendanceMap);
    console.log('=== Attendance update completed successfully ===');
    
    res.json({ success: true, data: attendanceMap });
  } catch (error) {
    console.error('=== Error in attendance update ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    console.error('Request body:', req.body);
    console.error('Teacher ID:', req.user._id);
    console.error('=== End of error details ===');
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate attendance record'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating attendance',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add this route for uploading test results
router.post('/upload-test-results', [auth, teacherAuth], async (req, res) => {
  console.log('Received test results upload request'); // Debug log
  try {
    const { results } = req.body;
    console.log('Received data:', results); // Debug log

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Insert all results
    const savedResults = await TestResult.insertMany(results);
    console.log('Saved results:', savedResults); // Debug log

    res.status(200).json({
      message: 'Test results uploaded successfully',
      count: savedResults.length
    });
  } catch (error) {
    console.error('Error uploading test results:', error);
    res.status(500).json({
      message: 'Error uploading test results',
      error: error.message
    });
  }
});

// Mark all attendance as absent
router.post('/mark-all-absent', [auth, teacherAuth], async (req, res) => {
  try {
    console.log('=== Starting mark all absent process ===');
    
    // Get all students
    const students = await Student.find();
    console.log(`Found ${students.length} students`);

    // Get dates for the last 30 days
    const dates = [];
    const currentDate = new Date();
    currentDate.setFullYear(2025); // Ensure we're using 2025
    currentDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    for (let i = 0; i <= 29; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      dates.push(date);
    }
    console.log(`Processing ${dates.length} dates`);

    // Process each student and date combination
    for (const student of students) {
      for (const date of dates) {
        try {
          // Find existing attendance record
          let attendance = await Attendance.findOne({
            student: student._id,
            date: date
          });

          if (attendance) {
            // Update existing record
            attendance.present = false;
            await attendance.save();
          } else {
            // Create new record
            const newAttendance = new Attendance({
              student: student._id,
              date: date,
              present: false,
              markedBy: req.user._id
            });
            await newAttendance.save();
          }
        } catch (error) {
          console.error(`Error processing attendance for student ${student._id} on date ${date}:`, error);
          // Continue with next record even if one fails
        }
      }
    }

    // Fetch updated attendance map
    const allAttendance = await Attendance.find();
    const attendanceMap = {};
    
    allAttendance.forEach(record => {
      const studentId = record.student.toString();
      const dateStr = record.date.toISOString().split('T')[0];
      
      if (!attendanceMap[studentId]) {
        attendanceMap[studentId] = {};
      }
      attendanceMap[studentId][dateStr] = record.present;
    });

    console.log('=== Mark all absent process completed successfully ===');
    res.json({ 
      success: true, 
      message: 'All attendance marked as absent',
      data: attendanceMap 
    });
  } catch (error) {
    console.error('=== Error in mark all absent process ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('=== End of error details ===');
    
    res.status(500).json({ 
      success: false, 
      message: 'Error marking all attendance as absent',
      error: error.message
    });
  }
});

// Get all tests
router.get('/tests', [auth, teacherAuth], async (req, res) => {
  try {
    console.log('\n=== Starting Test Results Fetch ===');
    
    // First, let's get all test results to debug
    const allResults = await TestResult.find();
    console.log('\n1. Raw Test Results:');
    console.log('Total documents found:', allResults.length);
    console.log('Sample document:', JSON.stringify(allResults[0], null, 2));
    
    // Log all unique test names
    const uniqueTestNames = [...new Set(allResults.map(r => r.testName))];
    console.log('\n2. Unique Test Names:', uniqueTestNames);

    // Get unique test names and their details
    const tests = await TestResult.aggregate([
      {
        $group: {
          _id: '$testName',
          testName: { $first: '$testName' },
          date: { $first: '$testDate' }, // Use testDate instead of date
          totalStudents: { $sum: 1 },
          totalMarks: { $sum: { $toDouble: { $ifNull: ['$marks', 0] } } },
          marks: { $push: { $toDouble: { $ifNull: ['$marks', 0] } } }
        }
      },
      {
        $project: {
          _id: 1,
          testName: 1,
          date: 1,
          totalStudents: 1,
          totalMarks: 1,
          marks: 1,
          averageScore: {
            $divide: ['$totalMarks', '$totalStudents']
          }
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    console.log('\n3. Aggregation Results:');
    tests.forEach((test, index) => {
      console.log(`\nTest ${index + 1}:`);
      console.log('Test Name:', test.testName);
      console.log('Date:', test.date);
      console.log('Total Students:', test.totalStudents);
      console.log('Total Marks:', test.totalMarks);
      console.log('Individual Marks:', test.marks);
      console.log('Calculated Average:', test.averageScore);
    });

    // Log the final response
    console.log('\n4. Final Response Data:', JSON.stringify(tests, null, 2));
    console.log('\n=== End of Test Results Fetch ===\n');

    res.json({ success: true, data: tests });
  } catch (error) {
    console.error('\n=== Error in Test Results Fetch ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('=== End of Error Details ===\n');
    
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tests',
      error: error.message
    });
  }
});

// Get test results for a specific test
router.get('/test-results/:testId', [auth, teacherAuth], async (req, res) => {
  try {
    console.log('=== Fetching test results ===');
    console.log('Test ID:', req.params.testId);

    // Get test results for the specified test name
    const results = await TestResult.find({ testName: req.params.testId })
      .select('studentName studentEmail marks testDate')
      .sort({ studentName: 1 });

    // Get test info
    const testInfo = await TestResult.findOne({ testName: req.params.testId })
      .select('testName testDate');

    if (!testInfo) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Calculate average score
    const totalMarks = results.reduce((sum, result) => sum + (result.marks || 0), 0);
    const averageScore = results.length > 0 ? (totalMarks / results.length) : 0;

    console.log(`Found ${results.length} results for test: ${testInfo.testName}`);
    console.log('Total Marks:', totalMarks);
    console.log('Average score:', averageScore);
    
    res.json({
      success: true,
      data: {
        testInfo: {
          ...testInfo.toObject(),
          date: testInfo.testDate, // Map testDate to date for frontend compatibility
          averageScore
        },
        results: results.map(result => ({
          ...result.toObject(),
          date: result.testDate, // Map testDate to date for frontend compatibility
          percentage: ((result.marks || 0) / 100) * 100
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test results',
      error: error.message
    });
  }
});

module.exports = router; 