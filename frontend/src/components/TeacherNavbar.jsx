import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Computer as ComputerIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/teacher/profile' },
    { text: 'Student DSA Profiles', icon: <CodeIcon />, path: '/teacher/dsa-profiles' },
    { text: 'Student Development Profiles', icon: <ComputerIcon />, path: '/teacher/dev-profiles' },
    { text: 'Create Assignment', icon: <AssignmentIcon />, path: '/teacher/create-assignment' },
    { text: 'Check Assignment Status', icon: <CheckCircleIcon />, path: '/teacher/assignment-status' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setDrawerOpen(true)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Teacher Portal
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default TeacherNavbar; 