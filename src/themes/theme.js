import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#1A1A1A', // Negro carbón
    },

    secondary: {
      main: '#C62828', // Rojo japonés
    },

    primaryLight: {
      main: '#F5F1E8', // Crema suave
      contrastText: '#C62828',
    },
  },
});