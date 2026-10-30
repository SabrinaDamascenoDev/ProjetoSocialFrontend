import { Navigate, type RouteObject } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { AcessoNegado } from './AcessoNegado';
import { PrivateRoute } from './PrivateRoute';
import { ModulePlaceholder } from '../pages/ModulePlaceholder';
import { Agentes } from '../pages/Agentes/Agentes';
import { RecuperarSenha } from '../pages/RecuperarSenha/RecuperarSenha';
import { EmailEnviado } from '../pages/RecuperarSenha/EmailEnviado';
import { RedefinirSenha } from '../pages/RecuperarSenha/RedefinirSenha';
import { SenhaRedefinida } from '../pages/RecuperarSenha/SenhaRedefinida';
import { DetalhesPlaca } from '../pages/Placas/DetalhesPlaca';
import { Placas } from '../pages/Placas/Placas';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/acesso-negado',
    element: <AcessoNegado />,
  },

  // Fluxo público de recuperação de senha (sem sidebar, sem auth)
  {
    path: '/recuperar-senha',
    element: <RecuperarSenha />,
  },
  {
    path: '/recuperar-senha/enviado',
    element: <EmailEnviado />,
  },
  {
    path: '/reset-password',
    element: <RedefinirSenha />,
  },
  {
    path: '/reset-password/sucesso',
    element: <SenhaRedefinida />,
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
        path: '/placas/:id',
        element: <DetalhesPlaca />,
      },
      {
        path: '/placas',
        element: <Placas />,
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
        element: <Agentes />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];