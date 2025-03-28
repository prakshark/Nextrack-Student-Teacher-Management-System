const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, phone, userType, leetcodeUsername, codechefUsername, githubUsername, linkedinProfileUrl } = req.body;

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

    // Create user based on type
    let user;
    if (userType === 'student') {
      // Validate student-specific fields
      if (!leetcodeUsername || !codechefUsername) {
        console.log('Missing student profile data:', { leetcodeUsername, codechefUsername });
        return res.status(400).json({ 
          success: false,
          message: 'Please provide your LeetCode and CodeChef usernames' 
        });
      }

      console.log('Creating new student with data:', {
        name,
        email,
        phone,
        leetcodeUsername,
        codechefUsername,
        githubUsername,
        linkedinProfileUrl
      });

      user = new Student({
        name,
        email,
        password, // Let the pre-save middleware handle hashing
        phone,
        leetcodeUsername,
        codechefUsername,
        githubUsername,
        linkedinProfileUrl
      });

      console.log('Student object created with githubUsername:', user.githubUsername);
    } else {
      console.log('Creating new teacher with data:', {
        name,
        email,
        phone
      });

      user = new Teacher({
        name,
        email,
        password, // Let the pre-save middleware handle hashing
        phone
      });
    }

    await user.save();
    console.log('User saved successfully:', {
      id: user._id,
      email: user.email,
      githubUsername: user.githubUsername
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType,
      leetcodeUsername: user.leetcodeUsername,
      codechefUsername: user.codechefUsername,
      githubUsername: user.githubUsername
    };

    console.log('Registration successful - User data:', userResponse);

    res.status(201).json({
      success: true,
      token,
      user: userResponse
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
    console.log('Login attempt:', { email, userType });

    // Validate required fields
    if (!email || !password || !userType) {
      console.log('Missing required fields:', { email, password, userType });
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

    // Find user
    const UserModel = userType === 'student' ? Student : Teacher;
    console.log('Looking for user in model:', userType === 'student' ? 'Student' : 'Teacher');
    
    const user = await UserModel.findOne({ email }).select('+password');
    console.log('User found:', user ? {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password,
      githubUsername: user.githubUsername
    } : null);
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    console.log('Checking password...');
    try {
      console.log('Attempting password comparison...');
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return res.status(500).json({
        success: false,
        message: 'Error during password verification'
      });
    }

    // Create JWT token
    console.log('Generating token for user:', { id: user._id, userType });
    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated successfully');

    // Remove password from response
    user.password = undefined;

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType,
      leetcodeUsername: user.leetcodeUsername,
      codechefUsername: user.codechefUsername,
      githubUsername: user.githubUsername
    };

    console.log('Login successful for user:', userResponse);

    res.json({
      success: true,
      token,
      user: userResponse
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

    console.log('Token verification - User found:', {
      id: user._id,
      email: user.email,
      githubUsername: user.githubUsername
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: decoded.userType,
      leetcodeUsername: user.leetcodeUsername,
      codechefUsername: user.codechefUsername,
      githubUsername: user.githubUsername
    };

    console.log('Token verification - Returning user data:', userResponse);

    res.json({
      success: true,
      user: userResponse
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

// Temporary debug route
exports.debugUser = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Debugging user:', email);

    // Check in both collections
    const student = await Student.findOne({ email }).select('+password');
    const teacher = await Teacher.findOne({ email }).select('+password');

    console.log('Student found:', student ? {
      id: student._id,
      email: student.email,
      hasPassword: !!student.password,
      githubUsername: student.githubUsername
    } : null);
    console.log('Teacher found:', teacher ? {
      id: teacher._id,
      email: teacher.email,
      hasPassword: !!teacher.password
    } : null);

    res.json({
      success: true,
      data: {
        student: student ? {
          id: student._id,
          email: student.email,
          hasPassword: !!student.password,
          githubUsername: student.githubUsername
        } : null,
        teacher: teacher ? {
          id: teacher._id,
          email: teacher.email,
          hasPassword: !!teacher.password
        } : null
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during debug',
      error: error.message
    });
  }
}; 