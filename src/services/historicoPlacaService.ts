import { historicoRepository } from '../repositories/historicoPlacaRepository';

export const historicoService = {
  async obterHistorico(placaId: string, page = 1, pageSize = 5) {
    return await historicoRepository.listarHistorico(placaId, page, pageSize);
  },
};