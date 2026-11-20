import type { UserRole } from './auth';

export interface PerfilUsuario {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  created_at: string;
}
