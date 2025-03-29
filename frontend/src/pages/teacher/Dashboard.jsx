import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cards = [
    {
      title: 'DSA Profile',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      path: '/dsa-profile',
      color: '#1976d2'
    },
    {
      title: 'Development',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      path: '/development',
      color: '#2e7d32'
    },
    {
      title: 'Assignments',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/assignments',
      color: '#ed6c02'
    },
    {
      title: 'Rankings',
      icon: <LeaderboardIcon sx={{ fontSize: 40 }} />,
      path: '/rankings',
      color: '#9c27b0'
    },
    {
      title: 'Profile',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      path: '/profile',
      color: '#1976d2'
    }
  ];

  const dsaSheets = [
    {
      title: "Striver's SDE Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
      color: '#1976d2',
      external: true
    },
    {
      title: "Love Babbar's DSA Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/',
      color: '#2e7d32',
      external: true
    },
    {
      title: "Apna College DSA Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://docs.google.com/spreadsheets/d/1hXserPuxVoWMG9Hs7y8wVdRCJTcj3xMBAEYUOXQ5Xag/edit#gid=0',
      color: '#ed6c02',
      external: true
    },
    {
      title: "Neetcode 150",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://neetcode.io/practice',
      color: '#9c27b0',
      external: true
    }
  ];

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

      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
        DSA Sheets
      </Typography>
      <Grid container spacing={3}>
        {dsaSheets.map((sheet) => (
          <Grid item xs={12} sm={6} md={3} key={sheet.title}>
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
              onClick={() => window.open(sheet.path, '_blank')}
            >
              <Box sx={{ color: sheet.color, mb: 2 }}>
                {sheet.icon}
              </Box>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                {sheet.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 