import { api } from '../lib/axios';
import type { EventoPlacaListResponse, EventoPlacaResponse  } from '../types/historico';

export const historicoRepository = {
  async listarHistorico(placaId: string, page: number, pageSize: number): Promise<EventoPlacaListResponse> {
    const response = await api.get<EventoPlacaListResponse>(`/placas/${placaId}/historico`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },
   async atualizarEvento(placaId: string, eventoId: string, dados: FormData): Promise<EventoPlacaResponse> {
    const response = await api.patch<EventoPlacaResponse>(`/placas/${placaId}/eventos/${eventoId}`, dados, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};