import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  Code as CodeIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as EmojiEventsIcon,
  CalendarMonth as CalendarIcon,
  EventAvailable as EventAvailableIcon,
  Logout as LogoutIcon,
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
      >
        <img 
          src="/Nextrackwithoutbglogo.png"
          alt="Nextrack Logo"
          style={{
            width: '200px',
            height: 'auto',
          }}
        />
        <IconButton
          onClick={handleLogout}
          sx={{
            color: '#dc3545',
            '&:hover': {
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
            }
          }}
        >
          <LogoutIcon />
        </IconButton>
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
          <Grid item xs={12} sm={6} md={4} key={card.title}>
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
    </Container>
  );
};

export default Dashboard; 