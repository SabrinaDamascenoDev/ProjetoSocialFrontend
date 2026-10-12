import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './lib/theme';
import { routes } from './routes';
import { Sidebar } from './components/Sidebar';

function AppContent() {
  const { pathname } = useLocation();
  const content = useRoutes(routes);

  const hideSidebarRoutes = ['/login', '/acesso-negado'];
  const hideSidebarPrefixes = ['/recuperar-senha', '/reset-password'];

  const showSidebar =
    !hideSidebarRoutes.includes(pathname) &&
    !hideSidebarPrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {showSidebar && <Sidebar />}
      {showSidebar ? <main className="sidebar-page">{content}</main> : content}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <BrowserRouter><AppContent /></BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
