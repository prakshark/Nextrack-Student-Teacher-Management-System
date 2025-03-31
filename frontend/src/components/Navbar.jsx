import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box 
          component="img"
          src="/Nextrackwithoutbglogo.png"
          alt="Nextrack Logo"
          sx={{ 
            height: { xs: 35, sm: 40 },
            width: 'auto',
            mr: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onClick={() => navigate('/')}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <IconButton
            onClick={handleMenu}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 