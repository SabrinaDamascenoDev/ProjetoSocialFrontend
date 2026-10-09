import { Navigate, type RouteObject } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { AcessoNegado } from './AcessoNegado';
import { ModulePlaceholder } from '../pages/ModulePlaceholder';

export const routes: RouteObject[] = [
  { path: '/login', element: <Login /> },
  { path: '/acesso-negado', element: <AcessoNegado /> },
  // Temporário durante o desenvolvimento da sidebar: restaurar PrivateRoute depois.
  // Ao integrar permissões, proteger /agentes e exibir seu link apenas para ADM.
  {
    children: [
      { index: true, element: <ModulePlaceholder title="Dashboard" /> },
      { path: '/mapa', element: <ModulePlaceholder title="Mapa" /> },
      { path: '/placas', element: <ModulePlaceholder title="Placas" /> },
      { path: '/estatisticas', element: <ModulePlaceholder title="Estatísticas" /> },
      { path: '/agentes', element: <ModulePlaceholder title="Agentes" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
