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
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TeacherTestResultDetails = () => {
  const [testResults, setTestResults] = useState([]);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view test results');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/teacher/test-results/${testId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setTestResults(response.data.data.results);
        setTestInfo(response.data.data.testInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Failed to fetch test results. Please try again later.');
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [testId]);

  const filteredResults = testResults.filter(result =>
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
        alignItems="center" 
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/teacher/test-results')}
        >
          Back to Tests
        </Button>
        <Typography variant="h4">
          {testInfo?.testName} - Results
        </Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Test Date: {testInfo && formatDate(testInfo.date)}
        </Typography>
        <TextField
          label="Search Students"
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
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Max Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result._id} hover>
                <TableCell>{result.studentName}</TableCell>
                <TableCell>{result.studentEmail}</TableCell>
                <TableCell>{result.marks}</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeacherTestResultDetails; 