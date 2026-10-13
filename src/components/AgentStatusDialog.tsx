import { useRef, useState } from 'react';
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { agentesService } from '../services/agentesService';
import type { Agente, UsuarioResponse } from '../types/agente';
import { mensagemErroAgente } from '../utils/agenteErrors';

interface Props {
  agente: Agente;
  onClose: () => void;
  onStatusChanged: (agente: UsuarioResponse) => void;
}

export function AgentStatusDialog({ agente, onClose, onStatusChanged }: Props) {
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const reativar = !agente.is_active;
  const acao = reativar ? 'reativar' : 'desativar';

  function close() {
    if (!pending.current) onClose();
  }

  async function confirm() {
    if (pending.current) return;
    pending.current = true;
    setSubmitting(true);
    setErro(null);
    try {
      const atualizado = await agentesService.atualizarStatus(agente.id, reativar);
      onStatusChanged(atualizado);
      toast.success(reativar ? 'Conta do agente reativada com sucesso!' : 'Conta do agente desativada com sucesso!', toastOptions);
    } catch (cause) {
      setErro(mensagemErroAgente(cause, acao));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm" aria-labelledby="agent-status-title"
      aria-describedby="agent-status-description" aria-busy={submitting}
      slotProps={{
        paper: { sx: { bgcolor: '#fff', borderRadius: 3 } },
        transition: { onEntered: () => cancelButton.current?.focus() },
      }}>
      <DialogTitle id="agent-status-title">{reativar ? 'Reativar' : 'Desativar'} conta do agente?</DialogTitle>
      <DialogContent>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <DialogContentText id="agent-status-description" sx={{ overflowWrap: 'anywhere' }}>
          Você está prestes a {acao} a conta de <strong>{agente.nome}</strong> ({agente.email}).{' '}
          {reativar ? 'A conta voltará a ficar ativa no sistema.' : 'A conta ficará inativa e continuará registrada no sistema.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: 'wrap' }}>
        <Button ref={cancelButton} autoFocus variant="outlined" disabled={submitting} onClick={close}>Cancelar</Button>
        <Button color={reativar ? 'success' : 'error'} disabled={submitting} onClick={() => void confirm()}>
          {submitting ? (reativar ? 'Reativando…' : 'Desativando…') : (reativar ? 'Reativar conta' : 'Desativar conta')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
