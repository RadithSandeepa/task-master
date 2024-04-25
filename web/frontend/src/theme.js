import {  createTheme } from '@mui/material/styles';
import { alpha } from '@mui/system/colorManipulator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#009688', // Teal as the primary color
    },
    secondary: {
      main: '#1a237e', // Navy blue as the secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: alpha('#009688', 0.8), 
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // More natural button text
    },
  },
});

export default theme;


