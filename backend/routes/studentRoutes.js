const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAssignments,
  getRankings,
  getCompletedAssignments,
  completeAssignment,
  uncompleteAssignment,
  getAttendance
} = require('../controllers/studentController');
const Assignment = require('../models/Assignment');

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Assignment routes
router.get('/assignments', auth, getAssignments);
router.get('/completed-assignments', auth, getCompletedAssignments);
router.post('/complete-assignment/:assignmentId', auth, completeAssignment);
router.post('/uncomplete-assignment/:assignmentId', auth, uncompleteAssignment);

// Rankings route
router.get('/rankings', auth, getRankings);
router.get('/attendance', auth, getAttendance);

// Update assignment completion status
router.post('/update-assignment-completion/:assignmentId', auth, async (req, res) => {
  try {
    console.log('\n=== Starting Assignment Completion Update ===');
    console.log('Assignment ID:', req.params.assignmentId);
    console.log('Student ID:', req.user._id);
    console.log('Completed:', req.body.completed);

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const studentId = req.user._id;
    const isCompleted = req.body.completed;

    if (isCompleted) {
      // Add student to completedBy if not already present
      if (!assignment.completedBy.includes(studentId)) {
        assignment.completedBy.push(studentId);
      }
    } else {
      // Remove student from completedBy
      assignment.completedBy = assignment.completedBy.filter(
        id => id.toString() !== studentId.toString()
      );
    }

    await assignment.save();
    console.log('Updated assignment:', assignment);
    console.log('=== Assignment Completion Update Completed ===\n');

    res.json({
      success: true,
      message: 'Assignment completion status updated successfully',
      data: assignment
    });
  } catch (error) {
    console.error('\n=== Error in Assignment Completion Update ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('=== End of Error Details ===\n');

    res.status(500).json({
      success: false,
      message: 'Error updating assignment completion status',
      error: error.message
    });
  }
});

module.exports = router; 