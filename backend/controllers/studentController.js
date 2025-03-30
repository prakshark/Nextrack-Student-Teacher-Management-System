const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
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

  // Check if assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Add to student's completed assignments if not already completed
  const student = await Student.findById(req.user.id);
  const isCompleted = student.completedAssignments.some(
    ca => ca.assignment.toString() === assignmentId
  );

  if (!isCompleted) {
    student.completedAssignments.push({
      assignment: assignmentId,
      completedAt: new Date()
    });
    await student.save();
    console.log('Assignment marked as completed');
  }

  res.json({
    success: true,
    message: 'Assignment marked as completed'
  });
});

// @desc    Mark an assignment as not completed
// @route   POST /api/student/uncomplete-assignment/:assignmentId
// @access  Private
const uncompleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  console.log('Marking assignment as not completed:', assignmentId);

  // Remove from student's completed assignments
  const student = await Student.findById(req.user.id);
  student.completedAssignments = student.completedAssignments.filter(
    ca => ca.assignment.toString() !== assignmentId
  );
  await student.save();
  console.log('Assignment marked as not completed');

  res.json({
    success: true,
    message: 'Assignment marked as not completed'
  });
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

module.exports = {
  getProfile,
  updateProfile,
  getAssignments,
  getCompletedAssignments,
  completeAssignment,
  uncompleteAssignment,
  getRankings
}; 