const express = require('express');
const auth = require('../middleware/auth');
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  markAssignmentComplete
} = require('../controllers/assignment');

const router = express.Router();

router.post('/', auth, createAssignment);
router.get('/', auth, getAssignments);
router.put('/:id', auth, updateAssignment);
router.delete('/:id', auth, deleteAssignment);
router.post('/:id/complete', auth, markAssignmentComplete);

module.exports = router; 