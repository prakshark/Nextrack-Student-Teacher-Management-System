import { Box } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'white'
      }}
    >
      <Box 
        component="img"
        src="/Nextrackwithoutbglogo.png"
        alt="Nextrack Logo"
        sx={{ 
          width: '200px',
          height: 'auto',
          animation: 'fastFadeLoop 1s infinite ease-in-out',
          '@keyframes fastFadeLoop': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.2 },
            '100%': { opacity: 1 }
          }
        }}
      />
    </Box>
  );
};

export default LoadingScreen; 