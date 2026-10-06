import { createBrowserRouter, Navigate } from 'react-router-dom';
import {Login} from '../pages/Login/Login';
import {Home} from '../pages/Home/Home';
import { PrivateRoute } from './PrivateRoute';
import { AcessoNegado } from './AcessoNegado';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/acesso-negado', element: <AcessoNegado /> },

  // só adm, usa o allowedRoles para dizer quais roles tem acesso
  {
    element: <PrivateRoute allowedRoles={['Role.ADMINISTRADOR']}/>,
    children: [{ path: '/', element: <Home /> }],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);