const express = require('express');
const auth = require('../middleware/auth');
const {
  registerTeacher,
  loginTeacher,
  assignAssignment,
  getRankings,
  getAssignmentCompletion,
  getStudentDetails,
  getAssignments,
  getAssignmentById,
  getAssignmentStatus,
  getStudentPerformance,
  getAllStudents,
  getAttendance,
  markAttendance
} = require('../controllers/teacher');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
router.post('/assignments', auth, assignAssignment);
router.get('/rankings', auth, getRankings);
router.get('/assignment-completion', auth, getAssignmentCompletion);
router.get('/student-details', auth, getStudentDetails);
router.get('/assignments', auth, getAssignments);
router.get('/assignments/:assignmentId', auth, getAssignmentById);
router.get('/assignment-status/:assignmentId', auth, getAssignmentStatus);
router.get('/student-performance', auth, getStudentPerformance);

// Attendance routes
router.get('/students', auth, getAllStudents);
router.get('/attendance', auth, getAttendance);
router.post('/attendance', auth, markAttendance);

module.exports = router; 