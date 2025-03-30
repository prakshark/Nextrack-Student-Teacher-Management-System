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

const TeacherDevProfiles = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch student details
        const response = await axios.get('http://localhost:5000/api/teacher/student-details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Fetch GitHub data for each student
        const studentsWithGithubData = await Promise.all(
          response.data.data.map(async (student) => {
            if (student.githubUsername) {
              try {
                const githubResponse = await axios.get(`https://api.github.com/users/${student.githubUsername}`);
                return {
                  ...student,
                  githubData: githubResponse.data
                };
              } catch (err) {
                console.error(`Error fetching GitHub data for ${student.name}:`, err);
                return {
                  ...student,
                  githubData: null
                };
              }
            }
            return student;
          })
        );

        setStudents(studentsWithGithubData);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.response?.data?.message || 'Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      (student.githubUsername && student.githubUsername.toLowerCase().includes(searchLower)) ||
      (student.linkedinProfileUrl && student.linkedinProfileUrl.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Student Development Profiles
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View student development profiles including GitHub statistics and LinkedIn information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name, email, or username..."
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>GitHub Profile</TableCell>
              <TableCell>GitHub Stats</TableCell>
              <TableCell>LinkedIn Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.githubUsername ? (
                    <Link
                      href={`https://github.com/${student.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {student.githubUsername}
                    </Link>
                  ) : (
                    <Chip label="Not Added" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {student.githubData ? (
                    <Box>
                      <Typography variant="body2">
                        Public Repos: {student.githubData.public_repos}
                      </Typography>
                      <Typography variant="body2">
                        Public Gists: {student.githubData.public_gists}
                      </Typography>
                      <Typography variant="body2">
                        Followers: {student.githubData.followers}
                      </Typography>
                      <Typography variant="body2">
                        Following: {student.githubData.following}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip label="No Stats" color="warning" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {student.linkedinProfileUrl ? (
                    <Link
                      href={student.linkedinProfileUrl.startsWith('http') ? student.linkedinProfileUrl : `https://www.${student.linkedinProfileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      View Profile
                    </Link>
                  ) : (
                    <Chip label="Not Added" color="error" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default TeacherDevProfiles; 