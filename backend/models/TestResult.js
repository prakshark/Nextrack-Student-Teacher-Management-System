const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testDate: {
    type: Date,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestResult', testResultSchema); 