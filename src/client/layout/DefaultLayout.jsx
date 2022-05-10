import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import StylesProvider from '@mui/styles/StylesProvider';
import PaperbaseThemeV5 from '../themes/Paperbase';


const generateClassName = createGenerateClassName({
  // By enabling this option, if you have non-MUI elements (e.g. `<div />`)
  // using MUI classes (e.g. `.MuiButton`) they will lose styles.
  // Make sure to convert them to use `styled()` or `<Box />` first.
  disableGlobal: true,
  // Class names will receive this seed to avoid name collisions.
  seed: 'mui-jss'
});

export default function DefaultLayout({ children }) {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={PaperbaseThemeV5}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* <CssBaseline /> */}
          {children}
        </Box>
      </ThemeProvider>
    </StylesProvider>
  );
}
