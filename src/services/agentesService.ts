import { agentesRepository } from '../repositories/agentesRepository';
import type { Agente, CriarAgentePayload, EditarAgentePayload } from '../types/agente';

export const agentesService = {
  async editar(id: number, dados: EditarAgentePayload) {
    return agentesRepository.editar(id, {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
    });
  },
  async atualizarStatus(id: number, isActive: boolean) {
    return agentesRepository.atualizarStatus(id, isActive);
  },
  async criar(dados: CriarAgentePayload) {
    return agentesRepository.criar({ nome: dados.nome.trim(), email: dados.email.trim() });
  },
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
