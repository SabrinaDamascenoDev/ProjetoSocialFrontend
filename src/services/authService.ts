import { authRepository } from '../repositories/authRepositorie'
import { authStorage } from '../utils/storage'
import type { LoginPayload } from '../types/auth'

export const authService = {
  async login(data: LoginPayload) {
    const response = await authRepository.login(data)

    authStorage.setToken(response.access_token)

    return response
  },

  logout() {
    authStorage.removeToken()
  },
}