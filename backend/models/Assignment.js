const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an assignment name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add an assignment description'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  links: {
    type: [String],
    required: [true, 'Please add at least one assignment link'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one link is required'
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  completedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema); 