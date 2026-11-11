import { api } from '../lib/axios';
import type { Tipos } from '../types/placa';

export const tiposPlacaRepository = {
  async listar(): Promise<Tipos[]> {
    const response = await api.get<Tipos[]>('/placas/tipos');
    return response.data;
  },
};