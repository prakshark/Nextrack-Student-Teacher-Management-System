const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, phone, userType, leetcodeProfileUrl, codechefProfileUrl, githubProfileUrl, linkedinProfileUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !userType) {
      console.log('Missing required fields:', { name, email, password, phone, userType });
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Validate user type
    if (!['student', 'teacher'].includes(userType)) {
      console.log('Invalid user type:', userType);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user type' 
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    
    console.log('Existing student:', existingStudent);
    console.log('Existing teacher:', existingTeacher);

    if (existingStudent || existingTeacher) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user based on type
    let user;
    if (userType === 'student') {
      // Validate student-specific fields
      if (!leetcodeProfileUrl || !codechefProfileUrl || !githubProfileUrl || !linkedinProfileUrl) {
        console.log('Missing student profile URLs:', { leetcodeProfileUrl, codechefProfileUrl, githubProfileUrl, linkedinProfileUrl });
        return res.status(400).json({ 
          success: false,
          message: 'Please provide all profile URLs for student registration' 
        });
      }

      console.log('Creating new student with data:', {
        name,
        email,
        phone,
        leetcodeProfileUrl,
        codechefProfileUrl,
        githubProfileUrl,
        linkedinProfileUrl
      });

      user = new Student({
        name,
        email,
        password: hashedPassword,
        phone,
        leetcodeProfileUrl,
        codechefProfileUrl,
        githubProfileUrl,
        linkedinProfileUrl
      });
    } else {
      console.log('Creating new teacher with data:', {
        name,
        email,
        phone
      });

      user = new Teacher({
        name,
        email,
        password: hashedPassword,
        phone
      });
    }

    await user.save();
    console.log('User created successfully:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Validate user type
    if (!['student', 'teacher'].includes(userType)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user type' 
      });
    }

    // Find user
    const UserModel = userType === 'student' ? Student : Teacher;
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// Verify token and get user data
exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const UserModel = decoded.userType === 'student' ? Student : Teacher;
    const user = await UserModel.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: decoded.userType
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: error.message 
    });
  }
}; 