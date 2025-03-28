import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Link,
  Chip,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

/**
 * TeacherDSASubmissions Component
 * 
 * This component displays a table of all students with their DSA (Data Structures and Algorithms)
 * profile information including LeetCode and CodeChef profiles.
 * 
 * Features:
 * - Displays student information in a table format
 * - Shows LeetCode and CodeChef profile links
 * - Includes search functionality to filter students
 * - Shows loading state while fetching data
 * - Handles and displays errors appropriately
 * - Responsive design for different screen sizes
 */
const TeacherDSASubmissions = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teacher/student-details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStudents(response.data.data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.response?.data?.message || 'Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.phone.toLowerCase().includes(searchLower) ||
      (student.leetcodeUsername && student.leetcodeUsername.toLowerCase().includes(searchLower)) ||
      (student.codechefUsername && student.codechefUsername.toLowerCase().includes(searchLower))
    );
  });

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Student DSA Profiles
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View and manage student DSA profiles including LeetCode and CodeChef information
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name, email, phone, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>LeetCode Profile</TableCell>
              <TableCell>CodeChef Profile</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  {student.leetcodeUsername ? (
                    <Link
                      href={`https://leetcode.com/${student.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {student.leetcodeUsername}
                    </Link>
                  ) : (
                    <Chip label="Not Added" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {student.codechefUsername ? (
                    <Link
                      href={`https://www.codechef.com/users/${student.codechefUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {student.codechefUsername}
                    </Link>
                  ) : (
                    <Chip label="Not Added" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {student.leetcodeUsername && student.codechefUsername ? (
                    <Chip label="Complete" color="success" size="small" />
                  ) : (
                    <Chip label="Incomplete" color="warning" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No Results Message */}
      {filteredStudents.length === 0 && (
        <Box mt={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            No students found matching your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TeacherDSASubmissions; 