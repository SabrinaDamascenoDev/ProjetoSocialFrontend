import { api } from '../lib/axios';
import type { CriarAgentePayload, EditarAgentePayload, UsuarioResponse } from '../types/agente';

export const agentesRepository = {
  async editar(id: number, dados: EditarAgentePayload): Promise<UsuarioResponse> {
    const response = await api.patch<UsuarioResponse>(`/users/${id}`, dados);
    return response.data;
  },
  async atualizarStatus(id: number, isActive: boolean): Promise<UsuarioResponse> {
    const response = await api.patch<UsuarioResponse>(`/users/${id}`, { is_active: isActive });
    return response.data;
  },
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
