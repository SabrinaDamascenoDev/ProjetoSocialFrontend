import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { toast } from 'sonner';

import { toastOptions } from '../../lib/toastOptions';
import { passwordService } from '../../services/passwordService';
import { AuthCardLayout } from '../../components/recuperar-senha/AuthCardLayout';
import {
  CheckSmallIcon,
  DecorativeIconBox,
  ErrorCircleIcon,
  InfoCircleIcon,
  LockSmallIcon,
  LockStarsIcon,
} from '../../components/recuperar-senha/icons';
import {
  isTokenExpired,
  parseResetError,
  type ResetFlowErrorCode,
} from './errors';
import { resetPasswordSchema, type ResetPasswordFormData } from './schema';

const USED_TOKEN_KEY = 'caca-placas-reset-used';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 52,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  '& .MuiInputBase-input': { fontSize: '0.95rem' },
};

/** "Uso único" defensivo no front — o backend não implementa ainda. */
function isTokenMarkedUsed(token: string) {
  try {
    const raw = sessionStorage.getItem(USED_TOKEN_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(token);
  } catch {
    return false;
  }
}

function markTokenUsed(token: string) {
  try {
    const raw = sessionStorage.getItem(USED_TOKEN_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(token)) list.push(token);
    sessionStorage.setItem(USED_TOKEN_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Estado inicial calculado de forma síncrona:
   * - sem token → null (o early return abaixo redireciona)
   * - token já usado no front → 'token_utilizado'
   * - token expirado (via JWT) → 'token_expirado'
   * - senão → null (mostra o form)
   *
   * Não existe endpoint /validate — a validação real do backend
   * acontece no submit. Aqui só antecipamos os casos que o front
   * consegue detectar sozinho pra poupar uma requisição e melhorar a UX.
   */
  const [errorState, setErrorState] = useState<ResetFlowErrorCode | null>(() => {
    if (!token) return null;
    if (isTokenMarkedUsed(token)) return 'token_utilizado';
    if (isTokenExpired(token)) return 'token_expirado';
    return null;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) return <Navigate to="/recuperar-senha" replace />;

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      setIsSubmitting(true);
      await passwordService.reset(token!, data.password);
      markTokenUsed(token!);
      navigate('/reset-password/sucesso', { replace: true });
    } catch (error) {
      const code = parseResetError(error, token);
      if (code !== 'unknown') {
        setErrorState(code);
      } else {
        toast.error(
          'Não foi possível redefinir a senha. Tente novamente.',
          toastOptions
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (errorState) {
    return (
      <LinkProblemScreen
        code={errorState}
        onRetry={() => navigate('/recuperar-senha')}
      />
    );
  }

  return (
    <AuthCardLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <DecorativeIconBox bg="primary.main">
          <LockStarsIcon />
        </DecorativeIconBox>
        <Typography
          sx={{ color: 'text.primary', fontSize: '1.75rem', fontWeight: 800, mb: 1 }}
        >
          Criar nova senha
        </Typography>
        <Typography
          sx={{ color: '#7A7A7A', fontSize: '0.95rem', mb: 3.5, maxWidth: 380 }}
        >
          Crie uma nova credencial segura para reestabelecer o acesso ao sistema.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography
          sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}
        >
          Nova senha
        </Typography>
        <TextField
          type={showPassword ? 'text' : 'password'}
          placeholder="Inserir nova senha"
          autoComplete="new-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockSmallIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    aria-label="mostrar senha"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...fieldSx, mb: 2 }}
        />

        <Typography
          sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}
        >
          Confirmar senha
        </Typography>
        <TextField
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repetir a nova senha"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <CheckSmallIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((s) => !s)}
                    edge="end"
                    aria-label="mostrar senha"
                  >
                    {showConfirm ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ ...fieldSx, mb: 2.5 }}
        />

        <Box
          sx={{
            backgroundColor: '#EAF0FA',
            borderRadius: 1.5,
            p: 1.75,
            mb: 3,
            display: 'flex',
            gap: 1.25,
          }}
        >
          <Box sx={{ mt: 0.25 }}>
            <InfoCircleIcon color="#1976D2" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '0.4px',
                mb: 0.75,
              }}
            >
              REQUISITOS DE SEGURANÇA:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
              <CheckSmallIcon color="#4CAF50" />
              <Typography sx={{ fontSize: '0.8rem', color: '#4A5568' }}>
                Mínimo de 5 caracteres
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CheckSmallIcon color="#4CAF50" />
              <Typography sx={{ fontSize: '0.8rem', color: '#4A5568' }}>
                Não pode haver uso de espaços na senha
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          type="submit"
          color="secondary"
          disabled={isSubmitting}
          sx={{
            width: '100%',
            fontWeight: 800,
            letterSpacing: '0.5px',
            height: 52,
            borderRadius: 1.5,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'SALVAR NOVA SENHA'
          )}
        </Button>
      </Box>
    </AuthCardLayout>
  );
}

/* ---------- Tela de erro (link expirado / usado / inválido) ---------- */

function LinkProblemScreen({
  code,
  onRetry,
}: {
  code: ResetFlowErrorCode;
  onRetry: () => void;
}) {
  const messages: Record<ResetFlowErrorCode, { title: string; description: string }> = {
    token_expirado: {
      title: 'Link expirado',
      description:
        'Este link de redefinição expirou. Por segurança, os links são válidos por apenas 30 minutos. Solicite um novo.',
    },
    token_utilizado: {
      title: 'Link já utilizado',
      description:
        'Este link de redefinição já foi utilizado. Cada link pode ser usado apenas uma vez. Solicite um novo.',
    },
    token_invalido: {
      title: 'Link inválido',
      description:
        'Este link de redefinição é inválido ou foi corrompido. Solicite um novo link para continuar.',
    },
    unknown: {
      title: 'Não foi possível validar',
      description:
        'Algo deu errado ao validar este link. Tente novamente ou solicite um novo.',
    },
  };

  const m = messages[code];

  return (
    <AuthCardLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <DecorativeIconBox bg="#FDE7E7">
          <ErrorCircleIcon color="#D32F2F" />
        </DecorativeIconBox>
        <Typography
          sx={{ color: 'text.primary', fontSize: '1.6rem', fontWeight: 800, mb: 1.5 }}
        >
          {m.title}
        </Typography>
        <Typography sx={{ color: '#7A7A7A', fontSize: '0.95rem', mb: 3, maxWidth: 380 }}>
          {m.description}
        </Typography>
        <Button
          onClick={onRetry}
          color="secondary"
          sx={{
            width: '100%',
            fontWeight: 800,
            letterSpacing: '0.5px',
            height: 52,
            borderRadius: 1.5,
          }}
        >
          SOLICITAR NOVO LINK
        </Button>
      </Box>
    </AuthCardLayout>
  );
}