const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an assignment name'],
    trim: true
  },
  link: {
    type: String,
    required: [true, 'Please add a link to the assignment']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
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