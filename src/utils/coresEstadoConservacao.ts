type Severidade = 'bom' | 'regular' | 'ruim' | 'neutro';

export interface CoresChip {
  fundo: string;
  texto: string;
}

const CORES_POR_SEVERIDADE: Record<Severidade, CoresChip> = {
  bom: { fundo: '#C8F0D0', texto: '#1B7A2F' },
  regular: { fundo: '#FFF1B8', texto: '#9A7B00' },
  ruim: { fundo: '#FFD0D0', texto: '#C62828' },
  neutro: { fundo: '#E0E0E0', texto: '#424242' },
};

const SEVERIDADE_POR_CODIGO: Record<string, Severidade> = {
  BOM: 'bom',
  REGULAR: 'regular',
  RUIM: 'ruim',
};

export function coresDoEstado(codigo: string): CoresChip {
  const severidade = SEVERIDADE_POR_CODIGO[codigo.trim().toUpperCase()] ?? 'neutro';
  return CORES_POR_SEVERIDADE[severidade];
}   