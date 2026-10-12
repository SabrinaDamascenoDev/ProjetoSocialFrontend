import { api } from '../lib/axios';
import type { CriarAgentePayload, UsuarioResponse } from '../types/agente';

export const agentesRepository = {
  async criar(dados: CriarAgentePayload): Promise<UsuarioResponse> {
    const response = await api.post<UsuarioResponse>('/users/', dados);
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