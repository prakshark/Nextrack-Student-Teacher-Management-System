import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Create Assignment Questions',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/create-assignment',
      color: '#1976d2'
    },
    {
      title: 'Check Assignment Status',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/assignment-status',
      color: '#2e7d32'
    },
    {
      title: 'Student Profiles',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/dsa-profiles',
      color: '#ed6c02'
    },
    {
      title: 'My Profile',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      path: '/teacher/profile',
      color: '#9c27b0'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Teacher Dashboard
        </Typography>
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 200,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3
                  }
                }}
                onClick={() => navigate(card.path)}
              >
                <Box sx={{ color: card.color, mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}
                >
                  {card.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeacherDashboard; 