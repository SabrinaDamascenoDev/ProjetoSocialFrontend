import type { Placa } from './placa';

export interface RegistroPlaca {
  id: string;
  data: string;
  tipo: string;
  descricao: string;
  responsavel: string;
  fotoUrl: string | null;
}

export interface DetalhesPlaca {
  placa: Placa;
  afastamento: string;
  tipoPelicula: string;
  tipoSubstrato: string;
  tipoSuporte: string;
  responsavel: string;
  observacoes: string;
  historico: RegistroPlaca[];
}

