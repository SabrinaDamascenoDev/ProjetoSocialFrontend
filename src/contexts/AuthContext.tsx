import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

import { authService } from '../services/authService'
import { authStorage } from '../utils/storage'
import { decodeToken } from '../utils/jwt'

interface AuthContextData {
  isAuthenticated: boolean
  role: string | null
  userId: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token = authStorage.getToken()

  const initialPayload = token
    ? decodeToken(token)
    : null

  const [isAuthenticated, setIsAuthenticated] = useState(!!token)
  const [role, setRole] = useState<string | null>(
    initialPayload?.role ?? null
  )
  const [userId, setUserId] = useState<string | null>(
    initialPayload?.sub ?? null
  )

  async function login(username: string, password: string) {
    const response = await authService.login({
      username,
      password,
    })

    const payload = decodeToken(response.access_token)

    setIsAuthenticated(true)
    setRole(payload.role)
    setUserId(payload.sub)
  }

  function logout() {
    authService.logout()

    setIsAuthenticated(false)
    setRole(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}