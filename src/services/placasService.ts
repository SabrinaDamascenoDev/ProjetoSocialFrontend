import { placasRepository } from '../repositories/placasRespository';
import type {
  EstadoConservacao,
  ListarPlacasParams,
  Placa,
  PlacaResponse,
  PlacasPaginadas,
} from '../types/placa';

export interface FiltrosPlacas {
  busca: string;
  estado: EstadoConservacao | 'todos';
  codigo_contran: string; 
  dataInicio: string;
  dataFim: string;
}

function montarEndereco(endereco: PlacaResponse['endereco']): string {
  if (!endereco) return 'Endereço não informado';
  return `${endereco.logradouro} - ${endereco.bairro}`;
}

function paraPlaca(r: PlacaResponse): Placa {
  const evento = r.ultimo_evento;

  return {
    id: r.id,
    codigo: r.codigo_contran,
    foto_url: evento?.foto_url ?? null,
    endereco: montarEndereco(r.endereco),
    estado_conservacao: evento?.estado_conservacao ?? null,
    pelicula: evento?.estado_pelicula ?? null,
    substrato: evento?.estado_substrato ?? null,
    suporte: evento?.estado_suporte ?? null,
    data_registro: r.created_at,
  };
}

export const placasService = {
  async listar(
    pagina: number,
    itensPorPagina: number,
    filtros: FiltrosPlacas,
  ): Promise<PlacasPaginadas> {
    const params: ListarPlacasParams = {
      page: pagina,
      page_size: itensPorPagina,
    };

    const busca = filtros.busca.trim();
    if (busca) params.busca = busca;
    if (filtros.estado !== 'todos') params.estado_conservacao = filtros.estado;
    if (filtros.codigo_contran !== 'todos') params.codigo_contran = filtros.codigo_contran;
    if (filtros.dataInicio) params.data_inicio = filtros.dataInicio;
    if (filtros.dataFim) params.data_fim = filtros.dataFim;

    const resposta = await placasRepository.listar(params);
    return { items: resposta.items.map(paraPlaca), total: resposta.total };
  },
};