import { api } from '../lib/axios';
import type { UsuarioResponse } from '../types/agente';

export const agentesRepository = {
  async criar(email: string): Promise<UsuarioResponse> {
    const response = await api.post<UsuarioResponse>('/users/', { email });
    return response.data;
  },
  async listarUsuarios(
    skip: number,
    limit: number,
  ): Promise<UsuarioResponse[]> {
    const response = await api.get<UsuarioResponse[]>('/users/', {
      params: { skip, limit },
    });

    return response.data;
  },
};