import { api } from '../lib/axios';
import type { PerfilUsuario } from '../types/perfil';

export const perfilRepository = {
  async obter(signal?: AbortSignal): Promise<PerfilUsuario> {
    const { data } = await api.get<PerfilUsuario>('/users/me', { signal });
    return data;
  },
};
