import { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CalendarView from "./components/CalendarView";
import C3 from "./components/c3";

function App() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#0a0a0a',
                  paper: '#1a1a1a',
                },
                primary: {
                  main: '#3b82f6',
                },
              }
            : {
                background: {
                  default: '#ffffff',
                  paper: '#ffffff',
                },
                primary: {
                  main: '#3b82f6',
                },
              }),
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          position: 'relative', 
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }} 
        className={mode}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'fixed',
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            zIndex: 1300,
            bgcolor: 'background.paper',
            boxShadow: 2,
            minWidth: 44,
            minHeight: 44,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 0, sm: 2 } }}>
          <C3 />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
