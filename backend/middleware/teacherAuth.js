const Teacher = require('../models/Teacher');

const teacherAuth = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(401).json({ message: 'Teacher not found' });
    }

    next();
  } catch (error) {
    console.error('Teacher Auth Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = teacherAuth; 