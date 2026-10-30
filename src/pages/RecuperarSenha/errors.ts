import { jwtDecode } from 'jwt-decode';

export type ResetFlowErrorCode =
  | 'token_expirado'
  | 'token_utilizado'
  | 'token_invalido'
  | 'unknown';

/**
 * Decodifica o JWT do reset e checa se está expirado.
 * O backend não diferencia "expirado" de "inválido" no detail,
 * então usamos o `exp` do próprio token pra refinar a UX.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return !!exp && exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

export function parseResetError(
  error: unknown,
  token?: string | null
): ResetFlowErrorCode {
  const e = error as {
    detail?: string;
    status?: number;
    response?: { data?: { detail?: string }; status?: number };
  };

  const detail = e?.detail ?? e?.response?.data?.detail;
  const status = e?.status ?? e?.response?.status;

  if (typeof detail === 'string') {
    const d = detail.toLowerCase();
    if (d.includes('expirad')) return 'token_expirado';
    if (d.includes('utilizad') || d.includes('usado')) return 'token_utilizado';
    if (d.includes('inválid') || d.includes('invalid')) {
      // Backend mistura "inválido ou expirado" — refina pelo JWT
      if (token && isTokenExpired(token)) return 'token_expirado';
      return 'token_invalido';
    }
  }

  // Fallbacks por status code
  if (status === 401 || status === 400) {
    if (token && isTokenExpired(token)) return 'token_expirado';
    return 'token_invalido';
  }
  if (status === 410) return 'token_expirado';
  if (status === 409) return 'token_utilizado';

  return 'unknown';
}