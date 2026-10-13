import type { UserRole } from './auth';

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export type Agente = UsuarioResponse & {
  role: 'AGENTE';
};
export interface CriarAgentePayload {
  nome: string;
  email: string;
}

export interface EditarAgentePayload {
  nome: string;
  email: string;
}
