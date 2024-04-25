import {  createTheme } from '@mui/material/styles';
import { alpha } from '@mui/system/colorManipulator';

const theme = createTheme({
  palette: {
    primary: {
        main: alpha('#1a237e', 0.8), 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: alpha('#1a237e', 0.8), 
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


