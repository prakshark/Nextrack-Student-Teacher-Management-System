import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import axios from 'axios';

const TeacherAssignmentStatus = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      console.log('Fetching assignments...');
      const response = await axios.get('http://localhost:5000/api/teacher/assignments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Assignments fetched:', response.data);
      setAssignments(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to fetch assignments. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/teacher/assignment-status/${assignmentId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
      <Typography variant="h4" gutterBottom>
        Assignment Status
      </Typography>
      
      {assignments.length === 0 ? (
        <Alert severity="info">No assignments found.</Alert>
      ) : (
        <List>
          {assignments.map((assignment) => (
            <Paper 
              key={assignment._id} 
              sx={{ 
                mb: 2, 
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleAssignmentClick(assignment._id)}
            >
              <ListItem alignItems="flex-start">
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {assignment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {assignment.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`Deadline: ${formatDate(assignment.deadline)}`}
                        color="primary"
                        size="small"
                      />
                      <Chip 
                        label={`Difficulty: ${assignment.difficulty}`}
                        color={assignment.difficulty === 'easy' ? 'success' : 
                               assignment.difficulty === 'medium' ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Assignment Links:
                    </Typography>
                    <List dense>
                      {assignment.links.map((link, linkIndex) => (
                        <ListItem key={linkIndex}>
                          <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
                          <ListItemText 
                            primary={
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#1976d2', textDecoration: 'none' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {link}
                              </a>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TeacherAssignmentStatus; 