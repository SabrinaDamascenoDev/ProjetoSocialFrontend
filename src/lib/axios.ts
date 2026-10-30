import axios from 'axios'
import { authStorage } from '../utils/storage'

// cria uma instância do axios com a URL base da API e interceptadores para adicionar o token de autenticação e lidar com erros
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const url = config.url ?? ''
    // Não sobrescreve Authorization em /auth/reset-password (token vem do repo)
    const isResetPassword = url.includes('/auth/reset-password')

    const token = authStorage.getToken()
    if (token && !isResetPassword) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url: string = error.config?.url ?? ''

    // Rotas do fluxo de autenticação não devem redirecionar para /login
    // quando retornam 401 (ex.: token de reset expirado/inválido).
    const isAuthFlowRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password') ||
      url.includes('/auth/validate-reset-token')

    if (status === 401 && !isAuthFlowRequest) {
      console.warn('401 recebido em:', url)
      authStorage.removeToken()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)