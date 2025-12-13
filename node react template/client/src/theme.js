// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#4CAF50' },   // green for main actions
    secondary: { main: '#81C784' }, // softer green for highlights
    error: { main: '#E57373' },    // soft red for cancel buttons
    cancel: { main: '#F44336' },     // standard Material red (optional)

    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333', // override AppBar globally
        },
      },
    },
  },
});

export default theme;
