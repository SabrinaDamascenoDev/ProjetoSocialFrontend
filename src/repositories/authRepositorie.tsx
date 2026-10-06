import { api } from '../lib/axios'
import type {
  LoginPayload,
  LoginResponse,
} from '../types/auth'

export const authRepository = {
 async login(
  data: LoginPayload
): Promise<LoginResponse> {
  const formData = new URLSearchParams()

  formData.append('username', data.username)
  formData.append('password', data.password)

  const response = await api.post<LoginResponse>(
    '/auth/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data
}

}