import { jwtDecode } from 'jwt-decode'
import type { TokenPayload } from '../types/auth'

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token)
}