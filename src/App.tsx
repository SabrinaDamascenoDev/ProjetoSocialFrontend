import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './lib/theme';
import { Login } from './pages/Login/Login';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </ThemeProvider>
  );
}