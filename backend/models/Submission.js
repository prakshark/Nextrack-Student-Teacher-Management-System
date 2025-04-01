const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema); 