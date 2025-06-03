import {createContext, type Dispatch, type SetStateAction} from 'react';

export interface IThemeContext {
    currentTheme: 'light' | 'dark';
    dispatchCurrentTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
}

export const ThemeContext =
    createContext<IThemeContext>({
        currentTheme: 'dark',
        dispatchCurrentTheme: () => {
        }
    });
