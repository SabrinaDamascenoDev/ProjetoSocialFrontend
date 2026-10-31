export type EstadoConservacao = 'BOM' | 'REGULAR' | 'RUIM';

export interface EnderecoResponse {
  logradouro: string;
  bairro: string;
  cep: string;
  referencia: string | null;
}

export interface UltimoEventoResponse {
  id: string;
  created_by: number;
  tipo_evento: string;
  observacao: string | null;
  timestamp: string;
  foto_url: string | null;
  estado_conservacao: EstadoConservacao | null;
  estado_pelicula: EstadoConservacao | null;
  estado_substrato: EstadoConservacao | null;
  estado_suporte: EstadoConservacao | null;
}

export interface PlacaResponse {
  id: string; 
  codigo_contran: string;
  afastamento: number | null;
  tipo_pelicula: string | null;
  tipo_substrato: string | null;
  tipo_suporte: string | null;
  created_at: string; 
  endereco: EnderecoResponse | null;
  ultimo_evento: UltimoEventoResponse | null;
}

export interface PlacasPaginadasResponse {
  items: PlacaResponse[];
  total: number;
}

export interface Placa {
  id: string; 
  codigo: string;
  foto_url: string | null;
  endereco: string;
  estado_conservacao: EstadoConservacao | null;
  pelicula: EstadoConservacao | null;
  substrato: EstadoConservacao | null;
  suporte: EstadoConservacao | null;
  data_registro: string;
}

export interface PlacasPaginadas {
  items: Placa[];
  total: number;
}

export interface ListarPlacasParams {
  page: number;
  page_size: number;
  busca?: string;
  estado_conservacao?: EstadoConservacao;
  tipo_placa?: string;
  codigo_contran?: string;
  data_inicio?: string;
  data_fim?: string;
}