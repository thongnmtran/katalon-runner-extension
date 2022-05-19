import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import StylesProvider from '@mui/styles/StylesProvider';
import EventName from 'main/utils/EventName';
import { lightTheme, darkTheme } from '../themes/Paperbase';


const generateClassName = createGenerateClassName({
  // By enabling this option, if you have non-MUI elements (e.g. `<div />`)
  // using MUI classes (e.g. `.MuiButton`) they will lose styles.
  // Make sure to convert them to use `styled()` or `<Box />` first.
  disableGlobal: true,
  // Class names will receive this seed to avoid name collisions.
  seed: 'mui-jss'
});

const ThemeType = {
  light: 'light',
  dark: 'dark',
  highContrast: 'highContrast',
  highContrastLight: 'highContrastLight'
};

const Themes = {
  [ThemeType.light]: lightTheme,
  [ThemeType.dark]: darkTheme
};

const ThemeId = {
  [ThemeType.light]: 1,
  [ThemeType.dark]: 2,
  [ThemeType.highContrast]: 3,
  [ThemeType.highContrastLight]: 4
};

const ThemeIdMap = {
  [ThemeId[ThemeType.light]]: ThemeType.light,
  [ThemeId[ThemeType.dark]]: ThemeType.dark,
  [ThemeId[ThemeType.highContrast]]: ThemeType.highContrast,
  [ThemeId[ThemeType.highContrastLight]]: ThemeType.highContrastLight
};

function getCurrentTheme() {
  return document.body.className.includes('vscode-dark')
    ? ThemeType.dark
    : ThemeType.light;
}

export default function DefaultLayout({ children }) {
  const [theme, setTheme] = React.useState(getCurrentTheme());

  React.useEffect(() => {
    function onMessage(event) {
      if (event?.data?.type === EventName.setTheme) {
        setTheme(ThemeIdMap[event?.data?.data]);
      }
    }
    window.addEventListener(EventName.message, onMessage);
    return () => {
      window.removeEventListener(EventName.message, onMessage);
    };
  }, []);

  console.log(theme);
  const activeTheme = Themes[theme];

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={activeTheme}>
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
          {/* <CssBaseline /> */}
          {children}
        </Box>
      </ThemeProvider>
    </StylesProvider>
  );
}
