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
        <Button onClick={() => { setNome(''); setEmail(''); setInvalidField(null); setCreatedEmail(null); }} sx={{ flex: 1, bgcolor: '#d9d9d9', color: '#011025', fontSize: { xs: 20, sm: 22 }, fontWeight: 700, height: 'auto', minHeight: 64, px: 3, py: 2, lineHeight: 1.3, '&:hover': { bgcolor: '#c9c9c9' } }}>Criar novo agente</Button>
        <Button onClick={onClose} sx={{ flex: 1, bgcolor: '#011025', fontSize: { xs: 20, sm: 22 }, fontWeight: 700, height: 'auto', minHeight: 64, px: 3, py: 2, lineHeight: 1.3 }}>Ir para a lista de agentes</Button>
      </Box>
    </DialogContent>
  </Dialog>;

  return <Dialog open onClose={() => { if (!pending.current) onClose(); }} fullWidth maxWidth="md"
    aria-label="Criar agente"
    slotProps={{ paper: { sx: { position: 'relative', bgcolor: '#fff', borderRadius: { xs: 4, sm: '56px' }, maxWidth: 716, m: 2, width: 'calc(100% - 32px)' } } }}>
    <IconButton aria-label="Fechar cadastro" disabled={submitting} onClick={onClose}
      sx={{ position: 'absolute', right: { xs: 16, sm: 36 }, top: { xs: 16, sm: 28 }, color: '#011025' }}><CloseIcon /></IconButton>
    <Box component="form" onSubmit={submit} noValidate sx={{ px: { xs: 3, sm: 8 }, pt: { xs: 9, sm: 14 }, pb: { xs: 5, sm: 16 } }}>
      <Typography component="label" htmlFor="agent-name" sx={{ display: 'block', fontSize: { xs: 24, sm: 30 }, fontWeight: 600, mb: 1 }}>Nome Completo</Typography>
      <TextField id="agent-name" autoFocus required fullWidth placeholder="Insira o seu nome completo..." autoComplete="name"
        value={nome} disabled={submitting} error={invalidField === 'nome'}
        onChange={event => { setNome(event.target.value); setInvalidField(null); }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: '#d9d9d9', height: 48 }, '& fieldset': { borderColor: 'transparent' } }} />
      <Typography component="label" htmlFor="agent-email" sx={{ display: 'block', fontSize: { xs: 24, sm: 30 }, fontWeight: 600, mb: 1 }}>E-mail</Typography>
      <TextField id="agent-email" required fullWidth type="email" placeholder="exemplo@gmail.com" autoComplete="email"
        value={email} disabled={submitting} error={invalidField === 'email'}
        onChange={event => { setEmail(event.target.value); setInvalidField(null); }}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#d9d9d9', height: 48 }, '& fieldset': { borderColor: 'transparent' } }} />
      <Button fullWidth type="submit" disabled={submitting} sx={{ mt: { xs: 5, sm: 8 }, bgcolor: '#011025', fontWeight: 700, fontSize: 22, minHeight: 64, height: 'auto', py: 2 }}>
        {submitting ? 'Criando…' : 'Criar Agente'}
      </Button>
    </Box>
  </Dialog>;
}
