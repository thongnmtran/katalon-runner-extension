import createTheme from '@mui/material/styles/createTheme';

// https://github.com/mui/material-ui/tree/master/docs/src/pages/premium-themes/paperbase


export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#32b171'
    },
    secondary: {
      main: '#255475'
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});
