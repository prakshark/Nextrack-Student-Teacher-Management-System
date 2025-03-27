const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// @desc    Create assignment
// @route   POST /api/assignment
// @access  Private
exports.createAssignment = async (req, res) => {
  try {
    const { name, link, deadline, studentIds } = req.body;

    const assignment = await Assignment.create({
      name,
      link,
      deadline,
      assignedTo: studentIds
    });

    // Update teacher's assigned assignments
    await Teacher.findByIdAndUpdate(req.user.userId, {
      $push: { assignedAssignments: assignment._id }
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignment
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    let assignments;
    if (req.user.userType === 'teacher') {
      // Get assignments created by the teacher
      assignments = await Assignment.find()
        .populate('assignedTo', 'name email')
        .populate('completedBy', 'name email');
    } else {
      // Get assignments assigned to the student
      assignments = await Assignment.find({
        assignedTo: req.user.userId
      })
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');
    }

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignment/:id
// @access  Private
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Only teacher can update assignments
    if (req.user.userType !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update assignments'
      });
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignment/:id
// @access  Private
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Only teacher can delete assignments
    if (req.user.userType !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete assignments'
      });
    }

    // Remove assignment from teacher's assigned assignments
    await Teacher.findByIdAndUpdate(req.user.userId, {
      $pull: { assignedAssignments: assignment._id }
    });

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark assignment as complete
// @route   POST /api/assignment/:id/complete
// @access  Private
exports.markAssignmentComplete = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Only students can complete assignments
    if (req.user.userType !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can complete assignments'
      });
    }

    // Check if student is assigned to this assignment
    if (!assignment.assignedTo.includes(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this assignment'
      });
    }

    // Add student to completedBy array if not already there
    if (!assignment.completedBy.includes(req.user.userId)) {
      assignment.completedBy.push(req.user.userId);
      await assignment.save();
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 