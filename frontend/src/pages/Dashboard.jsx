import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Paper
} from '@mui/material';
import {
  Code as CodeIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon,
  CalendarMonth as CalendarIcon,
  MenuBook as MenuBookIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const cards = [
    {
      title: 'DSA Profile',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      path: '/dsa-profile',
      color: theme.palette.primary.main
    },
    {
      title: 'Development Profile',
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      path: '/development',
      color: theme.palette.secondary.main
    },
    {
      title: 'Assignments',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/assignments',
      color: theme.palette.success.main
    },
    {
      title: 'Rankings',
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      path: '/rankings',
      color: theme.palette.warning.main
    },
    {
      title: 'Contest Calendar',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      path: 'https://competitiveprogramming.info/calendar',
      color: theme.palette.info.main,
      external: true
    },
    {
      title: 'My Attendance',
      icon: <EventAvailableIcon sx={{ fontSize: 40 }} />,
      path: '/attendance',
      color: '#0288d1'
    }
  ];

  const dsaSheets = [
    {
      title: "Striver's SDE Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
      color: theme.palette.primary.main,
      external: true
    },
    {
      title: "Love Babbar's DSA Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/',
      color: theme.palette.secondary.main,
      external: true
    },
    {
      title: "Apna College DSA Sheet",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://docs.google.com/spreadsheets/d/1hXserPuxVoWMG9Hs7y8wVdRCJTcj3xMBAEYUOXQ5Xag/edit#gid=0',
      color: theme.palette.success.main,
      external: true
    },
    {
      title: "Neetcode 150",
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      path: 'https://neetcode.io/practice',
      color: theme.palette.warning.main,
      external: true
    }
  ];

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
        Welcome, {user?.name || 'Student'}!
      </Typography>
      
      {/* Quick Access Cards */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Access
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => card.external ? window.open(card.path, '_blank') : navigate(card.path)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: card.color, mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography gutterBottom variant="h6" component="h2">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* DSA Sheets Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
        DSA Sheets
      </Typography>
      <Grid container spacing={3}>
        {dsaSheets.map((sheet) => (
          <Grid item xs={12} sm={6} md={3} key={sheet.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => window.open(sheet.path, '_blank')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: sheet.color, mb: 2 }}>
                  {sheet.icon}
                </Box>
                <Typography gutterBottom variant="h6" component="h2">
                  {sheet.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 