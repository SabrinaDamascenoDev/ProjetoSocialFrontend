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
    const token = authStorage.getToken()

    if (token) {
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
    const isLoginRequest = url.includes('/auth/login')

    if (status === 401 && !isLoginRequest) {
      console.warn('401 recebido em:', url)
      authStorage.removeToken()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)