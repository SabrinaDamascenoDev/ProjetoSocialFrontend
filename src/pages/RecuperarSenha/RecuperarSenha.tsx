import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { toast } from 'sonner';

import { toastOptions } from '../../lib/toastOptions';
import { passwordService } from '../../services/passwordService';
import { AuthCardLayout } from '../../components/recuperar-senha/AuthCardLayout';
import {
  DecorativeIconBox,
  InfoCircleIcon,
  LockAtIcon,
} from '../../components/recuperar-senha/icons';
import { emailSchema, type EmailFormData } from './schema';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 52,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  '& .MuiInputBase-input': { fontSize: '0.95rem' },
};

export function RecuperarSenha() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  async function onSubmit(data: EmailFormData) {
    try {
      setIsSubmitting(true);
      await passwordService.requestReset(data.email);
      navigate('/recuperar-senha/enviado', { state: { email: data.email } });
    } catch (error) {
      console.error('Erro ao solicitar redefinição:', error);
      toast.error('Não foi possível enviar as instruções. Tente novamente.', toastOptions);
    } finally {
      setIsSubmitting(false);
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
        <DecorativeIconBox bg="secondary.main">
          <LockAtIcon />
        </DecorativeIconBox>

        <Typography
          sx={{
            color: 'secondary.main',
            fontSize: '1.75rem',
            fontWeight: 800,
            mb: 1,
          }}
        >
          Recuperar Senha
        </Typography>
        <Typography
          sx={{ color: '#7A7A7A', fontSize: '0.95rem', mb: 3.5, maxWidth: 340 }}
        >
          Digite seu e-mail cadastrado para receber o link de redefinição.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography
          sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}
        >
          E-mail
        </Typography>
        <TextField
          type="email"
          autoComplete="email"
          placeholder="seuemail@exemplo.com"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ ...fieldSx, mb: 2.5 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <InfoCircleIcon />
          <Typography sx={{ fontSize: '0.85rem', color: '#7A7A7A' }}>
            O link expira em{' '}
            <strong style={{ color: '#011025' }}>30 minutos</strong> por segurança.
          </Typography>
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
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'ENVIAR INSTRUÇÕES'}
        </Button>
      </Box>
    </AuthCardLayout>
  );
}