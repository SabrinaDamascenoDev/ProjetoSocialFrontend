import { useState } from 'react';
import { Drawer } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './Sidebar.css';

const items = [
  { path: '/', label: 'Dashboard', Icon: HomeOutlinedIcon },
  { path: '/mapa', label: 'Mapa', Icon: LocationOnOutlinedIcon },
  { path: '/placas', label: 'Placas', Icon: ReportOutlinedIcon },
  { path: '/estatisticas', label: 'Estatísticas', Icon: ShowChartOutlinedIcon },
  { path: '/agentes', label: 'Agentes', Icon: PersonOutlinedIcon },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/login', { replace: true });
  }

  const visibleItems = items.filter(
    ({ path }) => path !== '/agentes' || role === 'ADMINISTRADOR'
  );

  const content = (
    <div className="sidebar-content">
      <div className="sidebar-brand">
        <img src={logo} alt="Caça Placas" />
      </div>

      <nav
        className="sidebar-navigation"
        aria-label="Navegação principal"
      >
        {visibleItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className="sidebar-link"
            onClick={() => setOpen(false)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        className="sidebar-logout"
        type="button"
        onClick={handleLogout}
      >
        <LogoutOutlinedIcon aria-hidden="true" />
        <span>Sair</span>
      </button>
    </div>
  );

  return (
    <>
      <button
        className="sidebar-toggle"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu de navegação"
        aria-expanded={open}
        aria-controls={open ? 'mobile-sidebar' : undefined}
      >
        <MenuIcon aria-hidden="true" />
        <span>Menu</span>
      </button>

      <aside className="sidebar-desktop">
        {content}
      </aside>

      <Drawer
        className="sidebar-mobile"
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            className: 'sidebar-paper',
            id: 'mobile-sidebar',
            'aria-label': 'Menu de navegação',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}