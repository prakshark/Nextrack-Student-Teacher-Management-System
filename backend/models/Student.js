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
  leetcodeUsername: {
    type: String,
    required: [true, 'Please add your LeetCode username']
  },
  codechefUsername: {
    type: String,
    required: [true, 'Please add your CodeChef username']
  },
  githubUsername: {
    type: String,
    required: false
  },
  linkedinProfileUrl: {
    type: String,
    required: false
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
  platformData: {
    leetcode: {
      data: Object,
      lastUpdated: Date
    },
    codechef: {
      data: Object,
      lastUpdated: Date
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
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema); 