import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold
      light: '#FFE55C',
      dark: '#B29700',
    },
    secondary: {
      main: '#9C27B0', // Purple
      light: '#D05CE3',
      dark: '#6A0080',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    h2: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    h3: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    h4: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    h5: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    h6: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '1px',
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 215, 0, .3)',
        },
        outlined: {
          borderColor: '#FFD700',
          color: '#FFD700',
          '&:hover': {
            borderColor: '#FFA500',
            color: '#FFA500',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 215, 0, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 215, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFD700',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 215, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
          },
        },
      },
    },
  },
});

export default theme; 