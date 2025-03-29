import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button
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
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          onClick={handleMenu}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="primary" onClick={handleLogout} startIcon={<LogoutIcon />}>
          Logout
        </Button>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.text} onClick={() => handleNavigation(item.path)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              {item.text}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default TeacherNavbar; 