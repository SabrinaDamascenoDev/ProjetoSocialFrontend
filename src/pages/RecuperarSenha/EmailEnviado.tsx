import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { toast } from 'sonner';

import { toastOptions } from '../../lib/toastOptions';
import { passwordService } from '../../services/passwordService';
import { AuthCardLayout } from '../../components/recuperar-senha/AuthCardLayout';
import {
  CheckPlainIcon,
  DecorativeIconBox,
  InfoCircleIcon,
} from '../../components/recuperar-senha/icons';

export function EmailEnviado() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const [isResending, setIsResending] = useState(false);

  // Se acessou direto sem passar pela tela 1, volta
  if (!email) return <Navigate to="/recuperar-senha" replace />;

  async function handleResend() {
    try {
      setIsResending(true);
      await passwordService.requestReset(email!);
      toast.success('Instruções reenviadas!', toastOptions);
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível reenviar. Tente novamente.', toastOptions);
    } finally {
      setIsResending(false);
    }
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
        <DecorativeIconBox bg="#DFF5DC">
          <CheckPlainIcon color="#4CAF50" />
        </DecorativeIconBox>

        <Typography
          sx={{ color: 'text.primary', fontSize: '1.75rem', fontWeight: 800, mb: 1.5 }}
        >
          E-mail enviado!
        </Typography>

        <Typography
          sx={{ color: '#7A7A7A', fontSize: '0.95rem', mb: 3, maxWidth: 380 }}
        >
          Se o endereço informado estiver cadastrado em nosso sistema, você receberá
          em instantes as instruções para redefinir sua senha.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <InfoCircleIcon />
          <Typography sx={{ fontSize: '0.85rem', color: '#7A7A7A' }}>
            O link expira em{' '}
            <strong style={{ color: '#011025' }}>30 minutos</strong> por segurança
          </Typography>
        </Box>

        <Button
          onClick={handleResend}
          color="secondary"
          disabled={isResending}
          sx={{
            width: '100%',
            fontWeight: 800,
            letterSpacing: '0.5px',
            height: 52,
            borderRadius: 1.5,
          }}
        >
          {isResending ? <CircularProgress size={22} color="inherit" /> : 'ENVIAR NOVAMENTE'}
        </Button>
      </Box>
    </AuthCardLayout>
  );
}