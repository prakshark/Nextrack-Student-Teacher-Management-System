# Student-Teacher Platform Documentation

## Overview

A comprehensive platform designed to facilitate interaction between students and teachers in an educational setting. The platform enables students to track their coding progress, receive assignments, and monitor rankings, while teachers can manage assignments and student performance.

**Tech Stack**: MERN (MongoDB, Express.js, React, Node.js)

## User Stories

### Student Features
- Registration and authentication
- DSA profile tracking (Leetcode, Codechef)
- Development progress monitoring (GitHub)
- Assignment management
- Performance rankings
- Profile customization

### Teacher Features
- Registration and authentication
- Assignment management
- Student performance tracking
- Ranking analysis
- Student profile management

## Core Features

### Student Portal

#### 1. Authentication
- **Registration Fields**:
  - Name
  - Email (`@glbitm.ac.in` domain)
  - Phone number
  - Leetcode profile URL
  - Codechef profile URL
  - GitHub profile URL
  - LinkedIn profile URL
- **Login**: Email-based authentication

#### 2. DSA Profile
- **Data Sources**:
  - Leetcode API: `https://alfa-leetcode-api.onrender.com/<username>`
  - Codechef API: `https://codechef-api.vercel.app/<username>`
- **Features**:
  - Problem-solving statistics
  - Contest participation tracking
  - Visual data representation (Chart.js/Recharts)

#### 3. Development Tracking
- **Data Source**:
  - GitHub API: `https://api.github.com/users/<username>`
- **Features**:
  - GitHub activity monitoring
  - Contribution statistics
  - Visual progress representation
  - Repository information
  - Followers and following count
  - Public gists and repositories
  - Account creation date
  - Last activity timestamp

#### 4. Assignment Management
- Assignment listing
- Submission tracking
- Deadline monitoring

#### 5. Rankings
- Multi-platform ranking system
- Overall performance metrics
- Interactive leaderboards

#### 6. Profile Management
- Information updates
- Profile validation
- URL management

### Teacher Portal

#### 1. Authentication
- Secure login/registration
- Domain-specific email validation

#### 2. Assignment Management
- Assignment creation
- Student selection
- Deadline setting
- Submission tracking

#### 3. Performance Analytics
- Student ranking analysis
- Platform-specific performance metrics
- Custom ranking filters

#### 4. Student Management
- Assignment completion tracking
- Student profile access
- Performance monitoring

## Technical Architecture

### Frontend
- React.js
- React Router
- Axios
- Chart.js/Recharts

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

## Database Schema

### Student Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  leetcodeProfileUrl: String,
  codechefProfileUrl: String,
  githubProfileUrl: String,
  linkedinProfileUrl: String,
  assignments: [Assignment],
  rankings: {
    leetcode: Object,
    codechef: Object,
    github: Object
  }
}
```

### Teacher Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  assignedAssignments: [Assignment]
}
```

### Assignment Model
```javascript
{
  name: String,
  link: String,
  deadline: Date,
  assignedTo: [Student],
  completedBy: [Student]
}
```

## API Endpoints

### Student Routes
- `POST /api/student/register`
- `POST /api/student/login`
- `GET /api/student/profile`
- `GET /api/student/assignments`
- `GET /api/student/ranking`
- `PUT /api/student/updateProfile`

### Teacher Routes
- `POST /api/teacher/register`
- `POST /api/teacher/login`
- `POST /api/teacher/assignAssignment`
- `GET /api/teacher/ranking`
- `GET /api/teacher/assignmentCompletion`
- `GET /api/teacher/studentDetails`

## Implementation Guidelines

1. **Authentication**
   - Implement JWT-based authentication
   - Validate email domains
   - Secure password handling

2. **Data Management**
   - Regular API synchronization
   - Efficient data caching
   - Error handling

3. **UI/UX**
   - Responsive design
   - Intuitive navigation
   - Real-time updates
   - Visual data representation

4. **Security**
   - Input validation
   - API rate limiting
   - Secure data transmission

## Future Enhancements

- Real-time notifications
- Mobile application
- Advanced analytics
- Integration with additional platforms
- Automated assignment grading
- Performance prediction models
