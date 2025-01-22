'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors } from './colors';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
    },
    secondary: {
      main: colors.secondary.main,
    },
  },
};

export const theme = createTheme(themeOptions);