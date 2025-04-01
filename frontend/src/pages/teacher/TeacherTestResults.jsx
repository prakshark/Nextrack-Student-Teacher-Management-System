import { useState, useEffect } from 'react';
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
  TextField,
  Box,
  Stack,
  Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherTestResults = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view test results');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/teacher/tests', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setTests(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError('Failed to fetch test data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter(test =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestClick = (testId) => {
    navigate(`/teacher/test-results/${testId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // If dateString is already a Date object
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">
          Test Results
        </Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Tests"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Students</TableCell>
              <TableCell>Max Score</TableCell>
              <TableCell>Average Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test._id} hover>
                <TableCell>{test.testName}</TableCell>
                <TableCell>{formatDate(test.date)}</TableCell>
                <TableCell>{test.totalStudents || 0}</TableCell>
                <TableCell>100</TableCell>
                <TableCell>{(test.averageScore || 0).toFixed(2)}%</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTestClick(test._id)}
                  >
                    View Results
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeacherTestResults; 