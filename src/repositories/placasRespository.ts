import { api } from '../lib/axios';
import type { ListarPlacasParams, PlacasPaginadasResponse } from '../types/placa';

export const placasRepository = {
  async listar(params: ListarPlacasParams): Promise<PlacasPaginadasResponse> {
    const response = await api.get<PlacasPaginadasResponse>('/placas/', { params });
    return response.data;
  },
};