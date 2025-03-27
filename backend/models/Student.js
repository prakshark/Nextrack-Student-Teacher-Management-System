const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please add a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  leetcodeProfileUrl: {
    type: String,
    required: [true, 'Please add your Leetcode profile URL']
  },
  codechefProfileUrl: {
    type: String,
    required: [true, 'Please add your Codechef profile URL']
  },
  githubProfileUrl: {
    type: String,
    required: [true, 'Please add your GitHub profile URL']
  },
  linkedinProfileUrl: {
    type: String,
    required: [true, 'Please add your LinkedIn profile URL']
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  rankings: {
    leetcode: {
      type: Object,
      default: {}
    },
    codechef: {
      type: Object,
      default: {}
    },
    github: {
      type: Object,
      default: {}
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema); 