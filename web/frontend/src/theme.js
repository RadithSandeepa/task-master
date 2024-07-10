// theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(7, 7, 83)',
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
      color: 'rgb(7, 7, 83)!important',
    },
  },
});

export default theme;


