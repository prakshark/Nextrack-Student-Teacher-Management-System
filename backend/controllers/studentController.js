const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const asyncHandler = require('express-async-handler');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id).select('-password');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  res.json({ success: true, data: student });
});

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({ success: true, data: student });
});

// @desc    Get all assignments
// @route   GET /api/student/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
  console.log('Getting assignments for student:', req.user.id);
  
  const assignments = await Assignment.find().sort('-createdAt');
  console.log('Found assignments:', assignments.length);
  
  res.json({ success: true, data: assignments });
});

// @desc    Get completed assignments for a student
// @route   GET /api/student/completed-assignments
// @access  Private
const getCompletedAssignments = asyncHandler(async (req, res) => {
  console.log('Getting completed assignments for student:', req.user.id);
  
  const student = await Student.findById(req.user.id)
    .select('completedAssignments')
    .populate('completedAssignments.assignment');

  console.log('Found completed assignments:', student?.completedAssignments?.length || 0);
  
  res.json({
    success: true,
    data: student?.completedAssignments || []
  });
});

// @desc    Mark an assignment as completed
// @route   POST /api/student/complete-assignment/:assignmentId
// @access  Private
const completeAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  console.log('Marking assignment as completed:', assignmentId);

  try {
    // Get both student and assignment
    const [student, assignment] = await Promise.all([
      Student.findById(req.user.id),
      Assignment.findById(assignmentId)
    ]);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    if (!assignment) {
      res.status(404);
      throw new Error('Assignment not found');
    }

    // Add to student's completed assignments if not already completed
    const isCompleted = student.completedAssignments.some(
      ca => ca.assignment.toString() === assignmentId
    );

    if (!isCompleted) {
      student.completedAssignments.push({
        assignment: assignmentId,
        completedAt: new Date()
      });

      // Add student to assignment's completedBy array if not already there
      if (!assignment.completedBy.includes(student._id)) {
        assignment.completedBy.push(student._id);
      }

      // Save both documents
      await Promise.all([
        student.save(),
        assignment.save()
      ]);

      console.log('Assignment marked as completed');
      console.log('Updated student:', student);
      console.log('Updated assignment:', assignment);
    }

    res.json({
      success: true,
      message: 'Assignment marked as completed'
    });
  } catch (error) {
    console.error('Error in completeAssignment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking assignment as completed'
    });
  }
});

// @desc    Mark an assignment as not completed
// @route   POST /api/student/uncomplete-assignment/:assignmentId
// @access  Private
const uncompleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  console.log('Marking assignment as not completed:', assignmentId);

  try {
    // Get both student and assignment
    const [student, assignment] = await Promise.all([
      Student.findById(req.user.id),
      Assignment.findById(assignmentId)
    ]);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    if (!assignment) {
      res.status(404);
      throw new Error('Assignment not found');
    }

    // Remove from student's completed assignments
    student.completedAssignments = student.completedAssignments.filter(
      ca => ca.assignment.toString() !== assignmentId
    );

    // Clean up completedBy array by removing null values and the current student
    assignment.completedBy = assignment.completedBy
      .filter(id => id && id.toString() !== student._id.toString());

    // Save both documents
    await Promise.all([
      student.save(),
      assignment.save()
    ]);

    console.log('Assignment marked as not completed');
    console.log('Updated student:', student);
    console.log('Updated assignment:', assignment);

    res.json({
      success: true,
      message: 'Assignment marked as not completed'
    });
  } catch (error) {
    console.error('Error in uncompleteAssignment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking assignment as not completed'
    });
  }
});

// @desc    Get student rankings
// @route   GET /api/student/rankings
// @access  Private
const getRankings = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id).select('rankings');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  res.json({ success: true, data: student.rankings });
});

const getAttendance = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  // Get attendance records for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  // Set time to noon to avoid timezone issues
  thirtyDaysAgo.setHours(12, 0, 0, 0);

  const attendanceRecords = await Attendance.find({
    student: studentId,
    date: { $gte: thirtyDaysAgo }
  });

  // Create a map of date to attendance status
  const attendance = {};
  let presentDays = 0;

  attendanceRecords.forEach(record => {
    const dateStr = record.date.toISOString().split('T')[0];
    attendance[dateStr] = true;
    presentDays++;
  });

  // Calculate attendance percentage
  const totalDays = 30;
  const percentage = Math.round((presentDays / totalDays) * 100);

  res.json({
    success: true,
    data: {
      attendance,
      percentage
    }
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getAssignments,
  getCompletedAssignments,
  completeAssignment,
  uncompleteAssignment,
  getRankings,
  getAttendance
}; 