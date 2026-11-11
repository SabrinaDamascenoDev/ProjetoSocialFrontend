import { api } from '../lib/axios';
import type { EventoPlacaListResponse } from '../types/historico';

export const historicoRepository = {
  async listarHistorico(placaId: string, page: number, pageSize: number): Promise<EventoPlacaListResponse> {
    const response = await api.get<EventoPlacaListResponse>(`/placas/${placaId}/historico`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },
};