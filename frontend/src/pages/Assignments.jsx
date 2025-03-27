import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Assignments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/assignments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAssignments(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleMarkComplete = async (assignmentId) => {
    try {
      await axios.post(`http://localhost:5000/api/assignment/${assignmentId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh assignments after marking as complete
      const response = await axios.get('http://localhost:5000/api/student/assignments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAssignments(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark assignment as complete');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>
      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} key={assignment._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {assignment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Link: <a href={assignment.link} target="_blank" rel="noopener noreferrer">{assignment.link}</a>
                    </Typography>
                  </Box>
                  <Box>
                    {assignment.completedBy.includes(user.id) ? (
                      <Chip label="Completed" color="success" />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleMarkComplete(assignment._id)}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {assignments.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No assignments available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Assignments; 