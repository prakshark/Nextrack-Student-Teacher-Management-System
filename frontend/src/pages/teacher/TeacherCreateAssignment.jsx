import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherCreateAssignment = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    links: [''],
    difficulty: 'easy'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      links: newLinks
    }));
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data before sending
      const formattedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        links: formData.links.filter(link => link.trim() !== ''), // Remove empty links
        difficulty: formData.difficulty
      };

      console.log('Formatted data being sent:', formattedData);

      // Validate required fields
      if (!formattedData.name || !formattedData.description || !formattedData.deadline || formattedData.links.length === 0) {
        setError('Please fill in all required fields and add at least one assignment link');
        return;
      }

      console.log('Making API request with data:', formattedData);
      const response = await axios.post(
        'http://localhost:5000/api/teacher/assignments',
        formattedData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('API Response:', response.data);
      setSuccess('Assignment created successfully!');
      setError('');
      // Reset form
      setFormData({
        name: '',
        description: '',
        deadline: '',
        links: [''],
        difficulty: 'easy'
      });
      // Navigate to assignment status page after 2 seconds
      setTimeout(() => {
        navigate('/teacher/assignment-status');
      }, 2000);
    } catch (err) {
      console.error('Error creating assignment:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      setError(err.response?.data?.message || 'Failed to create assignment. Please check all fields and try again.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Assignment
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assignment Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assignment Deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  label="Difficulty Level"
                  onChange={handleChange}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Assignment Links
              </Typography>
              <List>
                {formData.links.map((link, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      <TextField
                        fullWidth
                        label={`Assignment Link ${index + 1}`}
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        required
                        helperText="Enter the link to the assignment"
                      />
                    </ListItemText>
                    {formData.links.length > 1 && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => removeLink(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
              <Button
                startIcon={<AddIcon />}
                onClick={addLink}
                sx={{ mt: 1 }}
              >
                Add Another Link
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="large"
                >
                  Create Assignment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TeacherCreateAssignment; 