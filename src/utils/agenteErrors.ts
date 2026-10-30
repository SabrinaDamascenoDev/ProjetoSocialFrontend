import { isAxiosError } from 'axios';

export function mensagemErroAgente(cause: unknown, acao: 'editar' | 'desativar' | 'reativar'): string {
  const status = isAxiosError(cause) ? cause.response?.status : undefined;

  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Apenas administradores podem gerenciar agentes.';
  if (status === 404) return 'O agente não foi encontrado. Atualize a lista e tente novamente.';
  if (status === 409) {
    return acao === 'editar'
      ? 'Já existe uma conta com este e-mail.'
      : `Não foi possível ${acao} a conta. Tente novamente.`;
  }
  if (status === 422) return 'Verifique os dados informados e tente novamente.';

  return acao === 'editar'
    ? 'Não foi possível salvar as alterações. Tente novamente.'
    : `Não foi possível ${acao} a conta. Tente novamente.`;
}
