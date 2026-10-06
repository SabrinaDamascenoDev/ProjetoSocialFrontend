import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './lib/theme';
import { Login } from './pages/Login/Login';
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Login />
      </AuthProvider>
    </ThemeProvider>
  );
}