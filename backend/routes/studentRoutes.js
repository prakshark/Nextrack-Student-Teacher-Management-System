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

module.exports = router; 