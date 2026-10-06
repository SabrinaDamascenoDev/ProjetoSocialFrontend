export type UserRole = 'ADMINISTRADOR' | 'AGENTE';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
  exp?: number;
}