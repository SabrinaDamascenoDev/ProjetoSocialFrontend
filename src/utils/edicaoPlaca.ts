import { z } from 'zod';
import type { Placa } from '../types/placa';

// Valores do contrato PlacaUpdate e dos enums em placa_enums.py.
export const PELICULAS = { TIPO_I: 'Tipo I', TIPO_II: 'Tipo II', TIPO_III: 'Tipo III', TIPO_IV: 'Tipo IV', TIPO_X: 'Tipo X', NAO_REFLETIVA: 'Não refletiva', OUTRO: 'Outro' };
export const SUBSTRATOS = { ACO: 'Aço', ALUMINIO: 'Alumínio', MADEIRA: 'Madeira', FIBRA: 'Fibra', PLASTICO: 'Plástico', OUTRO: 'Outro' };
export const SUPORTES = { POSTE_ACO: 'Poste de aço', POSTE_MADEIRA: 'Poste de madeira', POSTE_CONCRETO: 'Poste de concreto', PORTICO: 'Pórtico', COLUNA_SEMAFORICA: 'Coluna semafórica', PAREDE_MURO: 'Parede / muro', OUTRO: 'Outro' };
export const FORMATOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

const schema = z.object({
  codigo_contran: z.string().trim().min(1, 'Selecione o código da placa.'),
  logradouro: z.string().trim(),
  tipo_pelicula: z.union([z.literal(''), z.enum(Object.keys(PELICULAS))]),
  tipo_substrato: z.union([z.literal(''), z.enum(Object.keys(SUBSTRATOS))]),
  tipo_suporte: z.union([z.literal(''), z.enum(Object.keys(SUPORTES))]),
  afastamento: z.string().trim().refine(value => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0), 'Informe uma distância válida, maior ou igual a zero.'),
});

export type EdicaoPlaca = z.infer<typeof schema>;

export function dadosEdicaoPlaca(placa: Placa): EdicaoPlaca {
  const { cadastro } = placa;
  return {
    codigo_contran: placa.codigo,
    logradouro: cadastro.endereco?.logradouro ?? '',
    tipo_pelicula: cadastro.tipo_pelicula ?? '', tipo_substrato: cadastro.tipo_substrato ?? '',
    tipo_suporte: cadastro.tipo_suporte ?? '', afastamento: cadastro.afastamento == null ? '' : String(cadastro.afastamento),
  };
}

export function validarFoto(foto: File): string | null {
  if (!FORMATOS_FOTO.includes(foto.type)) return 'Selecione uma imagem JPEG, PNG ou WEBP.';
  if (foto.size === 0) return 'O arquivo de imagem está vazio.';
  // O endpoint não declara limite de tamanho; não inventar um limite no cliente.
  return null;
}

export function validarEdicaoPlaca(placa: Placa, dados: EdicaoPlaca) {
  const result = schema.safeParse(dados);
  const errors: Partial<Record<keyof EdicaoPlaca, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) errors[issue.path[0] as keyof EdicaoPlaca] = issue.message;
  }
  const original = dadosEdicaoPlaca(placa);
  for (const campo of Object.keys(original) as (keyof EdicaoPlaca)[]) {
    if (original[campo] && !dados[campo].trim()) errors[campo] = 'Este valor pode ser alterado, mas não removido.';
  }
  return errors;
}

export function prepararEdicaoPlaca(placa: Placa, dados: EdicaoPlaca, foto: File | null): FormData {
  if (Object.keys(validarEdicaoPlaca(placa, dados)).length) throw new Error('Dados da placa inválidos.');
  if (foto) {
    const erro = validarFoto(foto);
    if (erro) throw new Error(erro);
  }
  const original = dadosEdicaoPlaca(placa);
  const form = new FormData();
  for (const campo of Object.keys(original) as (keyof EdicaoPlaca)[]) {
    const valor = dados[campo].trim();
    if (valor !== original[campo].trim() && valor !== '') form.append(campo, valor);
  }
  if (foto) form.append('foto', foto);
  return form;
}
