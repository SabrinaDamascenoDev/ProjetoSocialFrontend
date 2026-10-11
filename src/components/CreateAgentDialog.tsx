import { useRef, useState, type FormEvent } from 'react';
import { Box, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { z } from 'zod';
import { agentesService } from '../services/agentesService';

type Props = { onClose: () => void; onCreated: () => void };

export function CreateAgentDialog({ onClose, onCreated }: Props) {
  const [email, setEmail] = useState('');
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const result = z.email('Informe um e-mail válido.').safeParse(email.trim());
    if (!result.success) { setError('Informe um e-mail válido.'); return; }
    setError('');
    pending.current = true;
    setSubmitting(true);
    try {
      await agentesService.criar(result.data);
      setCreatedEmail(result.data);
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

  if (createdEmail) return <Dialog open onClose={onClose} fullWidth maxWidth="md"
    aria-labelledby="agent-success-title" aria-describedby="agent-success-description"
    slotProps={{ paper: { sx: { position: 'relative', bgcolor: '#fff', borderRadius: { xs: 4, sm: '56px' }, maxWidth: 716, m: 2, width: 'calc(100% - 32px)' } } }}>
    <IconButton autoFocus aria-label="Fechar confirmação" onClick={onClose} sx={{ position: 'absolute', right: { xs: 16, sm: 36 }, top: { xs: 16, sm: 28 }, color: '#011025' }}>
      <CloseIcon />
    </IconButton>
    <DialogContent sx={{ textAlign: 'center', px: { xs: 3, sm: 5.5 }, pt: { xs: 9, sm: 14 }, pb: { xs: 4, sm: 12 } }}>
      <Box aria-hidden="true" sx={{ width: 116, height: 116, borderRadius: '18px', background: 'radial-gradient(circle, #d6ffcd 20%, #a8d5a4 100%)', display: 'grid', placeItems: 'center', mx: 'auto', mb: 6 }}>
        <CheckRoundedIcon sx={{ color: '#289614', fontSize: 84 }} />
      </Box>
      <Typography id="agent-success-title" component="h2" sx={{ color: '#011025', fontWeight: 700, fontSize: { xs: 26, sm: 34 }, lineHeight: 1.2, mb: 1.5 }}>Agente criado com sucesso!</Typography>
      <Box id="agent-success-description" sx={{ color: '#687b98', fontSize: { xs: 18, sm: 24 }, lineHeight: 1.2 }}>
        <Typography sx={{ font: 'inherit' }}>A conta foi cadastrada para:</Typography>
        <Typography sx={{ fontSize: 'inherit', fontWeight: 700, overflowWrap: 'anywhere' }}>{createdEmail}</Typography>
        <Typography sx={{ font: 'inherit', mt: 3 }}>A senha de acesso é gerada pelo sistema.</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 6 }}>
        <Button onClick={() => { setEmail(''); setError(''); setCreatedEmail(null); }} sx={{ flex: 1, bgcolor: '#d9d9d9', color: '#011025', fontSize: { xs: 17, sm: 20 }, '&:hover': { bgcolor: '#c9c9c9' } }}>Criar novo agente</Button>
        <Button onClick={onClose} sx={{ flex: 1, bgcolor: '#011025', fontSize: { xs: 17, sm: 20 } }}>Ir para a lista de agentes</Button>
      </Box>
    </DialogContent>
  </Dialog>;

  return <Dialog open onClose={() => { if (!pending.current) onClose(); }} fullWidth maxWidth="xs"
    aria-labelledby="create-agent-title" aria-describedby="create-agent-description">
    <form onSubmit={submit} noValidate>
      <DialogTitle id="create-agent-title">Criar agente</DialogTitle>
      <DialogContent>
        <DialogContentText id="create-agent-description" sx={{ mb: 3 }}>Informe o e-mail do novo agente. A senha é gerada pelo sistema.</DialogContentText>
        <TextField autoFocus required fullWidth label="E-mail" type="email" autoComplete="email"
          value={email} disabled={submitting} error={!!error} helperText={error}
          onChange={event => { setEmail(event.target.value); setError(''); }} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button type="submit" color="secondary" disabled={submitting}>{submitting ? 'Criando…' : 'Criar agente'}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}
