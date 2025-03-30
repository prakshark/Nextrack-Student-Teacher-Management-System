import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#335C67', // Teal
      light: '#4B7C89',
      dark: '#234047',
      contrastText: '#FFF3B0',
    },
    secondary: {
      main: '#E09F3E', // Gold
      light: '#E8B665',
      dark: '#B47E31',
      contrastText: '#FFF3B0',
    },
    error: {
      main: '#9E2A2B', // Dark Red
      light: '#B54445',
      dark: '#7E2122',
      contrastText: '#FFF3B0',
    },
    warning: {
      main: '#E09F3E', // Gold
      light: '#E8B665',
      dark: '#B47E31',
      contrastText: '#335C67',
    },
    info: {
      main: '#335C67', // Teal
      light: '#4B7C89',
      dark: '#234047',
      contrastText: '#FFF3B0',
    },
    success: {
      main: '#335C67', // Teal
      light: '#4B7C89',
      dark: '#234047',
      contrastText: '#FFF3B0',
    },
    background: {
      default: '#FFF3B0', // Light Yellow
      paper: '#FFFFFF',
    },
    text: {
      primary: '#335C67',
      secondary: '#540B0E',
    },
  },
  typography: {
    fontFamily: '"Ubuntu", sans-serif',
    allVariants: {
      color: '#335C67',
    },
    h1: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Ubuntu", sans-serif',
          backgroundColor: '#FFF3B0',
          color: '#335C67',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#FFF3B0',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#335C67',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: '#234047',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF3B0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#335C67',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid rgba(51, 92, 103, 0.1)',
          boxShadow: '0 4px 12px rgba(51, 92, 103, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px rgba(51, 92, 103, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Ubuntu", sans-serif',
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          backgroundColor: '#335C67',
          color: '#FFF3B0',
          '&:hover': {
            backgroundColor: '#234047',
          },
        },
        outlined: {
          borderColor: '#335C67',
          color: '#335C67',
          '&:hover': {
            backgroundColor: 'rgba(51, 92, 103, 0.05)',
            borderColor: '#234047',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(51, 92, 103, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(51, 92, 103, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#335C67',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#335C67',
          },
          '& .MuiInputBase-input': {
            color: '#335C67',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#335C67',
          color: '#FFF3B0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFF3B0',
          color: '#335C67',
          borderRight: '1px solid rgba(51, 92, 103, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(51, 92, 103, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(51, 92, 103, 0.2)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(51, 92, 103, 0.05)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#335C67',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#335C67',
        },
        secondary: {
          color: '#540B0E',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(51, 92, 103, 0.1)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#335C67',
          '& .MuiTableCell-head': {
            color: '#FFF3B0',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#335C67',
          borderColor: 'rgba(51, 92, 103, 0.1)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(51, 92, 103, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(51, 92, 103, 0.05) !important',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(51, 92, 103, 0.1)',
          color: '#335C67',
          '&.MuiChip-clickable:hover': {
            backgroundColor: 'rgba(51, 92, 103, 0.2)',
          },
        },
        deleteIcon: {
          color: '#335C67',
          '&:hover': {
            color: '#9E2A2B',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: 'rgba(51, 92, 103, 0.1)',
          color: '#335C67',
        },
        standardError: {
          backgroundColor: 'rgba(158, 42, 43, 0.1)',
          color: '#9E2A2B',
        },
        standardWarning: {
          backgroundColor: 'rgba(224, 159, 62, 0.1)',
          color: '#E09F3E',
        },
        standardInfo: {
          backgroundColor: 'rgba(51, 92, 103, 0.1)',
          color: '#335C67',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#335C67',
          color: '#FFF3B0',
        },
      },
    },
  },
});

export default theme; 