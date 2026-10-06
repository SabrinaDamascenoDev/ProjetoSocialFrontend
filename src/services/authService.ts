import { authRepository } from "../repositories/authRepositorie";
import { authStorage } from "../utils/storage";
import type { LoginPayload } from "../types/auth";

// acessa a api e salva o token no storage
export const authService = {
  async login(data: LoginPayload, remember = false) {
    const response = await authRepository.login(data);

    authStorage.setToken(response.access_token, remember);

    return response;
  },

  logout() {
    authStorage.removeToken();
  },
};