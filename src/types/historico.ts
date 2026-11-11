export type TipoEvento = 'CRIACAO' | 'VISTORIA' | 'MANUTENCAO';

export interface EventoPlacaResponse {
  id: string;
  created_by: number;
  tipo_evento: TipoEvento;
  estado_conservacao: 'BOM' | 'REGULAR' | 'RUIM';
  estado_pelicula?: 'BOM' | 'REGULAR' | 'RUIM' | null;
  estado_substrato?: 'BOM' | 'REGULAR' | 'RUIM' | null;
  estado_suporte?: 'BOM' | 'REGULAR' | 'RUIM' | null;
  foto_url?: string | null;
  observacao?: string | null;
  timestamp: string;
}

export interface EventoPlacaListResponse {
  total: number;
  page: number;
  page_size: number;
  items: EventoPlacaResponse[];
}