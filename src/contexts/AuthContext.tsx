import { createContext, useContext, useState, type ReactNode } from "react";

import { authService } from "../services/authService";
import { authStorage } from "../utils/storage";
import { decodeToken } from "../utils/jwt";
import type { TokenPayload } from "../types/auth";

interface AuthContextData {
  isAuthenticated: boolean;
  role: string | null;
  userId: string | null;
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function isExpired(payload: TokenPayload) {
  const exp = (payload as { exp?: number }).exp;
  return !!exp && exp * 1000 < Date.now();
}

function getInitialPayload(): TokenPayload | null {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const payload = decodeToken(token);

    if (isExpired(payload)) {
      authStorage.removeToken();
      return null;
    }

    return payload;
  } catch {
    authStorage.removeToken();
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialPayload] = useState(getInitialPayload);

  const [isAuthenticated, setIsAuthenticated] = useState(!!initialPayload);
  const [role, setRole] = useState<string | null>(initialPayload?.role ?? null);
  const [userId, setUserId] = useState<string | null>(
    initialPayload?.sub ?? null
  );

  async function login(
    username: string,
    password: string,
    remember = false
  ) {
    const response = await authService.login({ username, password }, remember);

    let payload: TokenPayload;
    try {
      payload = decodeToken(response.access_token);
    } catch (error) {
      authStorage.removeToken();
      console.error("Falha ao decodificar o token:", error);
      throw error;
    }

    setRole(payload.role ?? null);
    setUserId(payload.sub ?? null);
    setIsAuthenticated(true);
  }

  function logout() {
    authService.logout();

    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}