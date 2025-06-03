import {useMemo, useState} from "react";
import {darkTheme, lightTheme} from "./utils/hooks/Theme.tsx";
import AppRoutes from "./AppRoutes.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";


function App() {

    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppRoutes/>
        </ThemeProvider>
    )
}

export default App
