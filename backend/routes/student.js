const express = require('express');
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAssignments,
  getRankings,
  toggleCompletion
} = require('../controllers/student');

const router = express.Router();

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/assignments', auth, getAssignments);
router.post('/assignments/:id/toggle-completion', auth, toggleCompletion);
router.get('/rankings', auth, getRankings);

module.exports = router; 