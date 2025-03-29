import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
            onClick={() => window.open('https://competitiveprogramming.info/calendar', '_blank')}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">
                Contest Calendar
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              View upcoming competitive programming contests and competitions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
            onClick={() => navigate('/teacher/create-assignment')}
          >
            <Typography variant="h6" gutterBottom>
              Create Assignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and assign new coding problems to students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
            onClick={() => navigate('/teacher/assignment-status')}
          >
            <Typography variant="h6" gutterBottom>
              Assignment Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track student submissions and assignment progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
            onClick={() => navigate('/teacher/rankings')}
          >
            <Typography variant="h6" gutterBottom>
              Rankings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View student rankings and performance metrics
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 