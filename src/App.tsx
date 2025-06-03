import {useMemo, useState} from "react";
import {darkTheme, lightTheme} from "./utils/hooks/Theme.tsx";
import AppRoutes from "./AppRoutes.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ThemeContext} from "./utils/contexts/ThemeContext.ts";


function App() {

    const [currentTheme, dispatchCurrentTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
    const theme = useMemo(() => (currentTheme === 'light' ? lightTheme : darkTheme), [currentTheme]);

    return (
        <ThemeContext.Provider value={{currentTheme, dispatchCurrentTheme}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppRoutes/>
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

export default App
