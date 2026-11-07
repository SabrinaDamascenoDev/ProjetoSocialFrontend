import { api } from '../lib/axios';
import type { ListarPlacasParams, PlacaResponse, PlacasPaginadasResponse } from '../types/placa';

export const placasRepository = {
  async editar(id: string, dados: FormData): Promise<PlacaResponse> {
    const response = await api.patch<PlacaResponse>(`/placas/${id}`, dados, {
      // Remove o padrão JSON; o navegador define o boundary do multipart.
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
  async listar(params: ListarPlacasParams): Promise<PlacasPaginadasResponse> {
    const response = await api.get<PlacasPaginadasResponse>('/placas/', { params });
    return response.data;
  },
};
