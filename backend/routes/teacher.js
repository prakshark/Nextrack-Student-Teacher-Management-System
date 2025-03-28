const express = require('express');
const auth = require('../middleware/auth');
const {
  registerTeacher,
  loginTeacher,
  assignAssignment,
  getRankings,
  getAssignmentCompletion,
  getStudentDetails,
  getAssignments
} = require('../controllers/teacher');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
router.post('/assignments', auth, assignAssignment);
router.get('/assignments', auth, getAssignments);
router.get('/rankings', auth, getRankings);
router.get('/assignment-completion', auth, getAssignmentCompletion);
router.get('/student-details', auth, getStudentDetails);

module.exports = router; 