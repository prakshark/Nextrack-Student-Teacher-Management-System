const mongoose = require('mongoose');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/nextrack';

async function syncAssignmentCompletion() {
  try {
    console.log('\n=== Starting Assignment Completion Sync ===');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get all completed submissions
    const completedSubmissions = await Submission.find({ status: 'completed' })
      .select('studentId assignmentId')
      .lean();
    
    console.log(`Found ${completedSubmissions.length} completed submissions`);
    
    // Create maps to track completed assignments for each student
    const studentAssignments = new Map();
    const assignmentStudents = new Map();
    
    // Process each submission
    for (const submission of completedSubmissions) {
      const studentId = submission.studentId.toString();
      const assignmentId = submission.assignmentId.toString();
      
      // Add to student's completed assignments
      if (!studentAssignments.has(studentId)) {
        studentAssignments.set(studentId, new Set());
      }
      studentAssignments.get(studentId).add(assignmentId);
      
      // Add to assignment's completed students
      if (!assignmentStudents.has(assignmentId)) {
        assignmentStudents.set(assignmentId, new Set());
      }
      assignmentStudents.get(assignmentId).add(studentId);
    }
    
    // Update Student collection
    console.log('\nUpdating Student collection...');
    for (const [studentId, assignments] of studentAssignments) {
      const student = await Student.findById(studentId);
      if (student) {
        student.completedAssignments = Array.from(assignments);
        await student.save();
        console.log(`Updated student ${student.name} with ${assignments.size} completed assignments`);
      }
    }
    
    // Update Assignment collection
    console.log('\nUpdating Assignment collection...');
    for (const [assignmentId, students] of assignmentStudents) {
      const assignment = await Assignment.findById(assignmentId);
      if (assignment) {
        assignment.completedBy = Array.from(students);
        await assignment.save();
        console.log(`Updated assignment ${assignment.title} with ${students.size} completed students`);
      }
    }
    
    // Print summary
    console.log('\n=== Sync Summary ===');
    console.log(`Total completed submissions: ${completedSubmissions.length}`);
    console.log(`Total students with completed assignments: ${studentAssignments.size}`);
    console.log(`Total assignments with completed students: ${assignmentStudents.size}`);
    
    console.log('\n=== Assignment Completion Sync Completed Successfully ===\n');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('\n=== Error in Assignment Completion Sync ===');
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('=== End of Error Details ===\n');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(1);
  }
}

// Run the sync
syncAssignmentCompletion(); 