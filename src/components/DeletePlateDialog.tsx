import { useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { placasService } from '../services/placasService';
import type { Placa } from '../types/placa';

interface Props {
  placa: Placa;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeletePlateDialog({ placa, onClose, onDeleted }: Props) {
  const [sucesso, setSucesso] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const pending = useRef(false);
  const cancelButton = useRef<HTMLButtonElement>(null);

  function close() {
    if (!pending.current) onClose();
  }

  async function confirmar() {
    if (pending.current || sucesso) return;
    pending.current = true;
    setSubmitting(true);
    setErro(null);
    try {
      await placasService.excluir(placa.id);
    } catch (cause) {
      const status = isAxiosError(cause) ? cause.response?.status : undefined;
      setErro(status === 404
        ? 'Esta placa não foi encontrada ou já foi excluída. Atualize a listagem.'
        : status === 403
          ? 'Você não tem permissão para excluir esta placa.'
          : 'Não foi possível excluir a placa. Tente novamente.');
      return;
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
    setSucesso(true);
    onDeleted();
  }

  return (
    <Dialog open onClose={close} fullWidth maxWidth={false} aria-labelledby="delete-plate-title"
      aria-describedby="delete-plate-description" aria-busy={submitting}
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(1, 16, 37, .50)' } },
        transition: { onEntered: () => cancelButton.current?.focus() },
        paper: { sx: {
          bgcolor: sucesso ? '#ffcccc' : '#fff', borderRadius: { xs: '24px', sm: '38px' },
          width: 476, minHeight: 374, m: 2, maxWidth: 'calc(100% - 32px)',
          px: { xs: 2.5, sm: 3 }, py: 5, textAlign: 'center',
          '& .MuiButton-root': { minHeight: 36, height: 'auto', fontSize: 12, borderRadius: '6px' },
        } },
      }}>
      <Box aria-hidden="true" sx={{
        mx: 'auto', mb: 1.5, width: 68, height: 68, display: 'grid', placeItems: 'center',
        color: '#ff0000', bgcolor: sucesso ? '#ddd' : '#ffcccc',
        borderRadius: sucesso ? '12px' : '50%',
        boxShadow: sucesso ? 'inset 0 0 12px #aaa' : 'none',
      }}>
        {sucesso ? <CheckIcon sx={{ fontSize: 54 }} /> : <DeleteIcon sx={{ fontSize: 40 }} />}
      </Box>
      <DialogTitle id="delete-plate-title" sx={{ p: 0, mb: 2, color: '#e00000', fontWeight: 700, fontSize: sucesso ? 20 : 26 }}>
        {sucesso ? 'Placa de sinalização excluída com sucesso!' : 'Excluir Placa'}
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflow: 'visible' }}>
        <DialogContentText id="delete-plate-description" sx={{ color: '#111', fontSize: 16, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
          {sucesso ? <>O registro da placa {placa.codigo} foi excluído do sistema e a lista de placas foi atualizada. Clique em retornar para visualizar.</>
            : <>Tem certeza que deseja excluir a placa {placa.codigo}?<br />Esta ação não poderá ser desfeita.</>}
        </DialogContentText>
        {erro && <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>{erro}</Alert>}
      </DialogContent>
      <DialogActions sx={{ p: 0, mt: sucesso ? 4 : 2, justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {sucesso ? <Button autoFocus onClick={close} sx={{ minWidth: 126 }}>Retornar</Button> : <>
          <Button ref={cancelButton} autoFocus disabled={submitting} onClick={close}
            sx={{ bgcolor: '#9ca3af', color: '#000', minWidth: 92, '&:hover': { bgcolor: '#8b929e' } }}>Cancelar</Button>
          <Button disabled={submitting} onClick={() => void confirmar()}
            sx={{ bgcolor: '#ff0000', color: '#fff', minWidth: 126, '&:hover': { bgcolor: '#cc0000' } }}>
            {submitting ? 'Excluindo…' : 'Sim, Excluir'}
          </Button>
        </>}
      </DialogActions>
    </Dialog>
  );
}
