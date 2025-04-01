import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'DSA Profile', icon: <CodeIcon />, path: '/dsa-profile' },
  { text: 'Development', icon: <CodeIcon />, path: '/development' },
  { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
  { text: 'Rankings', icon: <LeaderboardIcon />, path: '/rankings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.paper'
        }}
      >
        <Box 
          component="img"
          src="/Nextrackwithoutbglogo.png"
          alt="Nextrack Logo"
          style={{
            width: '180px',
            height: 'auto',
            padding: '8px',
            animation: 'fadeLoop 3s infinite ease-in-out'
          }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar; 