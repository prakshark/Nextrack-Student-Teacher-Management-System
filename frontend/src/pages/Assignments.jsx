import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        console.log('Fetching assignments...');
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'Present' : 'Missing');
        
        const response = await axios.get('http://localhost:5000/api/student/assignments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Raw response:', response.data);
        
        const assignmentsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log('Processed assignments array:', assignmentsArray);
        
        const sortedAssignments = assignmentsArray.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        console.log('Sorted assignments:', sortedAssignments);
        setAssignments(sortedAssignments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to fetch assignments. Please try again later.');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const displayedAssignments = selectedDifficulty === 'all'
    ? assignments
    : assignments.filter(assignment => assignment.difficulty === selectedDifficulty);

  console.log('Current assignments state:', assignments);
  console.log('Displayed assignments:', displayedAssignments);

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Assignments
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={selectedDifficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
          >
            <MenuItem value="all">All Difficulties</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {displayedAssignments.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No assignments available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {displayedAssignments.map((assignment) => (
            <Grid item xs={12} key={assignment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {assignment.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Due: {new Date(assignment.deadline).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Difficulty: {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {assignment.description}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question Links:
                  </Typography>
                  {assignment.links.map((link, index) => (
                    <Typography key={index} variant="body2" color="primary">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Question {index + 1}
                      </a>
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Assignments; 