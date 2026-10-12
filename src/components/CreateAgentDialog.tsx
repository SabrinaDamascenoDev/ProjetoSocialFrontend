import { useRef, useState, type FormEvent } from 'react';
import { Box, IconButton, Typography, Button, Dialog, DialogContent, TextField } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { z } from 'zod';
import { agentesService } from '../services/agentesService';

type Props = { onClose: () => void; onCreated: () => void };

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 58,
    borderRadius: 1.5,
  },
  '& .MuiInputLabel-root': {
    color: 'text.primary',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'secondary.main',
  },
};

const paperSx = {
  position: 'relative',
  bgcolor: '#fff',
  borderRadius: { xs: 3, sm: '32px' },
  maxWidth: 520,
  m: 2,
  width: 'calc(100% - 32px)',
};

const closeBtnSx = {
  position: 'absolute',
  right: { xs: 12, sm: 24 },
  top: { xs: 12, sm: 20 },
  color: '#011025',
};

export function CreateAgentDialog({ onClose, onCreated }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<'nome' | 'email' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    if (!nome.trim()) {
      setInvalidField('nome');
      toast.error('Informe o nome completo.', toastOptions);
      return;
    }
    const result = z.email('Informe um e-mail válido.').safeParse(email.trim());
    if (!result.success) {
      setInvalidField('email');
      toast.error('Informe um e-mail válido.', toastOptions);
      return;
    }
    setInvalidField(null);
    pending.current = true;
    setSubmitting(true);
    try {
      const agente = await agentesService.criar({ nome, email: result.data });
      setCreatedEmail(agente.email);
      onCreated();
    } catch (cause) {
      const status = isAxiosError(cause) ? cause.response?.status : undefined;
      const message = status === 409 ? 'Já existe uma conta com este e-mail.'
        : status === 403 ? 'Apenas administradores podem criar agentes.'
        : status === 422 ? 'Não foi possível concluir o cadastro. Entre em contato com o suporte.'
        : 'Não foi possível criar o agente. Tente novamente.';
      toast.error(message, toastOptions);
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  if (createdEmail) return <Dialog open onClose={onClose} fullWidth maxWidth="sm"
    aria-labelledby="agent-success-title" aria-describedby="agent-success-description"
    slotProps={{ paper: { sx: paperSx } }}>
    <IconButton autoFocus aria-label="Fechar confirmação" onClick={onClose} sx={closeBtnSx}>
      <CloseIcon />
    </IconButton>
    <DialogContent sx={{ textAlign: 'center', px: { xs: 3, sm: 4.5 }, pt: { xs: 7, sm: 9 }, pb: { xs: 4, sm: 6 } }}>
      <Box aria-hidden="true" sx={{ width: 88, height: 88, borderRadius: '16px', background: 'radial-gradient(circle, #d6ffcd 20%, #a8d5a4 100%)', display: 'grid', placeItems: 'center', mx: 'auto', mb: 4 }}>
        <CheckRoundedIcon sx={{ color: '#289614', fontSize: 64 }} />
      </Box>
      <Typography id="agent-success-title" component="h2" sx={{ color: '#011025', fontWeight: 700, fontSize: { xs: 22, sm: 28 }, lineHeight: 1.2, mb: 1.5 }}>Agente criado com sucesso!</Typography>
      <Box id="agent-success-description" sx={{ color: '#687b98', fontSize: { xs: 16, sm: 18 }, lineHeight: 1.3 }}>
        <Typography sx={{ font: 'inherit' }}>A conta foi cadastrada para:</Typography>
        <Typography sx={{ fontSize: 'inherit', fontWeight: 700, overflowWrap: 'anywhere' }}>{createdEmail}</Typography>
        <Typography sx={{ font: 'inherit', mt: 2 }}>A senha de acesso é gerada pelo sistema.</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 4 }}>
        <Button onClick={() => { setNome(''); setEmail(''); setInvalidField(null); setCreatedEmail(null); }} sx={{ flex: 1, bgcolor: '#d9d9d9', color: '#011025', fontSize: { xs: 16, sm: 18 }, fontWeight: 700, height: 'auto', minHeight: 52, px: 2, py: 1.5, lineHeight: 1.3, borderRadius: 1.5, '&:hover': { bgcolor: '#c9c9c9' } }}>Criar novo agente</Button>
        <Button onClick={onClose} sx={{ flex: 1, bgcolor: '#011025', fontSize: { xs: 16, sm: 18 }, fontWeight: 700, height: 'auto', minHeight: 52, px: 2, py: 1.5, lineHeight: 1.3, borderRadius: 1.5 }}>Ir para a lista de agentes</Button>
      </Box>
    </DialogContent>
  </Dialog>;

  return <Dialog open onClose={() => { if (!pending.current) onClose(); }} fullWidth maxWidth="sm"
    aria-label="Criar agente"
    slotProps={{ paper: { sx: paperSx } }}>
    <IconButton aria-label="Fechar cadastro" disabled={submitting} onClick={onClose} sx={closeBtnSx}><CloseIcon /></IconButton>
    <Box component="form" onSubmit={submit} noValidate sx={{ px: { xs: 3, sm: 5 }, pt: { xs: 8, sm: 10 }, pb: { xs: 4, sm: 6 }, display: 'flex', flexDirection: 'column' }}>
      <TextField
        id="agent-name"
        label="Nome completo"
        autoFocus
        required
        fullWidth
        autoComplete="name"
        value={nome}
        disabled={submitting}
        error={invalidField === 'nome'}
        onChange={event => { setNome(event.target.value); setInvalidField(null); }}
        sx={{ ...fieldSx, mb: 2.2 }}
      />
      <TextField
        id="agent-email"
        label="E-mail"
        required
        fullWidth
        type="email"
        autoComplete="email"
        value={email}
        disabled={submitting}
        error={invalidField === 'email'}
        onChange={event => { setEmail(event.target.value); setInvalidField(null); }}
        sx={fieldSx}
      />
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: { xs: 4, sm: 5 }, height: 58, borderRadius: 1.5, fontSize: '1.3rem', fontWeight: 700, '&:hover': { bgcolor: 'primary.dark' } }}
      >
        {submitting ? 'Criando…' : 'Criar Agente'}
      </Button>
    </Box>
  </Dialog>;
}