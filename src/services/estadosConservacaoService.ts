import { estadosConservacaoRepository } from '../repositories/estadosConservacaoRepository';
import type { Tipos } from '../types/placa';

let cache: Tipos[] | null = null;
let emAndamento: Promise<Tipos[]> | null = null;

export const estadosConservacaoService = {
  async listar(): Promise<Tipos[]> {
    if (cache) return cache;
    if (emAndamento) return emAndamento;

    emAndamento = estadosConservacaoRepository
      .listar()
      .then((estados) => {
        cache = estados;
        return estados;
      })
      .finally(() => {
        emAndamento = null;
      });

    return emAndamento;
  },
};