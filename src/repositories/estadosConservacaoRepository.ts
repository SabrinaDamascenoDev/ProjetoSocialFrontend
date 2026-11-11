import { api } from '../lib/axios';
import type { Tipos } from '../types/placa';

export const estadosConservacaoRepository = {
  async listar(): Promise<Tipos[]> {
    const response = await api.get<Tipos[]>('/placas/estados-conservacao');
    return response.data;
  },
};