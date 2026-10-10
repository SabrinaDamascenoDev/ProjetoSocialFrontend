import { Navigate, type RouteObject } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { AcessoNegado } from './AcessoNegado';
import { PrivateRoute } from './PrivateRoute';
import { ModulePlaceholder } from '../pages/ModulePlaceholder';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/acesso-negado',
    element: <AcessoNegado />,
  },

  // Todas estas rotas exigem autenticação
  {
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <ModulePlaceholder title="Dashboard" />,
      },
      {
        path: '/mapa',
        element: <ModulePlaceholder title="Mapa" />,
      },
      {
        path: '/placas',
        element: <ModulePlaceholder title="Placas" />,
      },
      {
        path: '/estatisticas',
        element: <ModulePlaceholder title="Estatísticas" />,
      },
    ],
  },

  // Esta rota exige autenticação E role de administrador
  {
    element: <PrivateRoute allowedRoles={['ADMINISTRADOR']} />,
    children: [
      {
        path: '/agentes',
        element: <ModulePlaceholder title="Agentes" />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
