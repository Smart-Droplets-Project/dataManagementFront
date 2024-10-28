'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1962ad',
    },
    secondary: {
      main: '#c5d42c',
    },
  },
};

export const theme = createTheme(themeOptions);