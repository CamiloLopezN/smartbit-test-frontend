import {createTheme} from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0077C2',
            light: '#59a5f5',
            dark: '#00619a',
        },
        secondary: {
            main: '#00BFFF',
        },
        background: {
            default: '#FFFFFF',
            paper: '#f5f5f5',
        },
        text: {
            primary: '#333333',
            secondary: '#5c5c5c',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1F3A5F',
            light: '#4d648d',
            dark: '#3D5A80',
        },
        secondary: {
            main: '#cee8ff',
        },
        background: {
            default: '#0F1C2E',
            paper: '#1f2b3e',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#e0e0e0',
        },
    },
});
