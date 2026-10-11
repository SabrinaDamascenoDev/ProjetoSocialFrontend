import { agentesRepository } from '../repositories/agentesRepository';
import type { Agente } from '../types/agente';

export const agentesService = {
  async listar(): Promise<Agente[]> {
    const agentes: Agente[] = [];
    const limit = 100;
    let skip = 0;

    while (true) {
      const usuarios = await agentesRepository.listarUsuarios(skip, limit);

      agentes.push(
        ...usuarios.filter(
          (usuario): usuario is Agente => usuario.role === 'AGENTE',
        ),
      );

      if (usuarios.length < limit) {
        break;
      }

      skip += limit;
    }

    return agentes;
  },
};