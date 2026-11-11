import { tiposPlacaRepository } from '../repositories/tipoPlacasRepository';
import type { Tipos } from '../types/placa';

let cache: Tipos[] | null = null;
let emAndamento: Promise<Tipos[]> | null = null;

export const tiposPlacaService = {
  async listar(): Promise<Tipos[]> {
    if (cache) return cache;
    if (emAndamento) return emAndamento;

    emAndamento = tiposPlacaRepository
      .listar()
      .then((tiposPlacas) => {
        cache = tiposPlacas;
        return tiposPlacas;
      })
      .finally(() => {
        emAndamento = null;
      });

    return emAndamento;
  },
};