import { useRef, useState, type FormEvent } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from '@mui/material';
import { toast } from 'sonner';
import { z } from 'zod';
import { toastOptions } from '../lib/toastOptions';
import { agentesService } from '../services/agentesService';
import type { Agente, UsuarioResponse } from '../types/agente';
import { mensagemErroAgente } from '../utils/agenteErrors';

interface Props {
  agente: Agente;
  onClose: () => void;
  onSaved: (agente: UsuarioResponse) => void;
}

const schema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome completo.'),
  email: z.email('Informe um e-mail válido.').trim(),
});

export function EditAgentDialog({ agente, onClose, onSaved }: Props) {
  const [nome, setNome] = useState(agente.nome);
  const [email, setEmail] = useState(agente.email);
  const [errors, setErrors] = useState<{ nome?: string; email?: string }>({});
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);

  function close() {
    if (!pending.current) onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;

    const result = schema.safeParse({ nome, email: email.trim() });
    if (!result.success) {
      const fields = z.flattenError(result.error).fieldErrors;
      setErrors({ nome: fields.nome?.[0], email: fields.email?.[0] });
      return;
    }

    setErrors({});
    setErro(null);
    pending.current = true;
    setSubmitting(true);
    try {
      const atualizado = await agentesService.editar(agente.id, result.data);
      onSaved(atualizado);
      toast.success('Agente atualizado com sucesso!', toastOptions);
    } catch (cause) {
      setErro(mensagemErroAgente(cause, 'editar'));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm" aria-labelledby="edit-agent-title"
      slotProps={{ paper: { sx: { bgcolor: '#fff', borderRadius: 3 } } }}>
      <Box component="form" onSubmit={submit} noValidate aria-busy={submitting}>
        <DialogTitle id="edit-agent-title">Editar agente</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '12px !important' }}>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField label="Nome completo" autoFocus required autoComplete="name"
            value={nome} disabled={submitting} error={!!errors.nome} helperText={errors.nome}
            onChange={(event) => { setNome(event.target.value); setErrors(current => ({ ...current, nome: undefined })); }} />
          <TextField label="E-mail" type="email" required autoComplete="email"
            value={email} disabled={submitting} error={!!errors.email} helperText={errors.email}
            onChange={(event) => { setEmail(event.target.value); setErrors(current => ({ ...current, email: undefined })); }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" disabled={submitting} onClick={close}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
