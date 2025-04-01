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
  Alert,
  Checkbox,
  FormControlLabel,
  Stack,
  Chip
} from '@mui/material';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [completedAssignments, setCompletedAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch assignments...');
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        if (!token) {
          setError('Please login to view assignments');
          setLoading(false);
          return;
        }

        const [assignmentsRes, completedRes] = await Promise.all([
          axios.get('http://localhost:5000/api/student/assignments', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://localhost:5000/api/student/completed-assignments', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        console.log('Raw assignments response:', assignmentsRes.data);
        console.log('Raw completed assignments response:', completedRes.data);
        
        const assignmentsArray = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data.data || [];
        const completedArray = completedRes.data.data
          .filter(ca => ca && ca.assignment)
          .map(ca => ca.assignment._id);
        
        console.log('Processed assignments array:', assignmentsArray);
        console.log('Processed completed array:', completedArray);
        
        const sortedAssignments = assignmentsArray.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setAssignments(sortedAssignments);
        setCompletedAssignments(completedArray);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          stack: err.stack
        });
        setError('Failed to fetch assignments. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleAssignmentCompletion = async (assignmentId, isCompleted) => {
    try {
      console.log('\n=== Starting Assignment Completion Update ===');
      console.log('Assignment ID:', assignmentId);
      console.log('Is Completed:', isCompleted);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update assignment status');
        return;
      }

      const endpoint = isCompleted ? 'complete-assignment' : 'uncomplete-assignment';
      console.log('Using endpoint:', endpoint);
      
      // Make a single API call to update both student and assignment
      const response = await axios.post(
        `http://localhost:5000/api/student/${endpoint}/${assignmentId}`, 
        {}, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success) {
        // Update local state
        if (isCompleted) {
          setCompletedAssignments([...completedAssignments, assignmentId]);
        } else {
          setCompletedAssignments(completedAssignments.filter(id => id !== assignmentId));
        }
        console.log('Local state updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update assignment status');
      }
    } catch (err) {
      console.error('\n=== Error in Assignment Completion Update ===');
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      console.error('=== End of Error Details ===\n');
      
      setError(err.response?.data?.message || 'Failed to update assignment status. Please try again.');
    }
  };

  const displayedAssignments = selectedDifficulty === 'all'
    ? assignments
    : assignments.filter(assignment => assignment.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#335C67';
      case 'medium':
        return '#E09F3E';
      case 'hard':
        return '#9E2A2B';
      default:
        return '#335C67';
    }
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
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      {assignment.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Chip
                        label={assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: getDifficultyColor(assignment.difficulty),
                          color: '#FFF3B0',
                          fontWeight: 600
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={completedAssignments.includes(assignment._id)}
                            onChange={(e) => handleAssignmentCompletion(assignment._id, e.target.checked)}
                            color="success"
                          />
                        }
                        label="Completed"
                      />
                    </Box>
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    Due: {new Date(assignment.deadline).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {assignment.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Question Links:
                    </Typography>
                    {assignment.links.map((link, index) => (
                      <Typography key={index} variant="body2" color="primary">
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#335C67' }}
                        >
                          Question {index + 1}
                        </a>
                      </Typography>
                    ))}
                  </Box>
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