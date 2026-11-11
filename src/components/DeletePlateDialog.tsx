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
    <Dialog
      open
      onClose={close}
      fullWidth
      maxWidth="sm"
      aria-labelledby="delete-plate-title"
      aria-describedby="delete-plate-description"
      aria-busy={submitting}
      slotProps={{
        transition: { onEntered: () => cancelButton.current?.focus() },
        paper: { sx: { bgcolor: '#fff', borderRadius: 3 } },
      }}
    >
      <DialogTitle
        id="delete-plate-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            color: sucesso ? 'success.main' : 'error.main',
            bgcolor: sucesso ? 'success.light' : 'error.light',
          }}
        >
          {sucesso ? <CheckIcon sx={{ fontSize: 28 }} /> : <DeleteIcon sx={{ fontSize: 28 }} />}
        </Box>
        {sucesso ? 'Placa excluída com sucesso!' : 'Excluir placa'}
      </DialogTitle>

      <DialogContent sx={{ pt: '12px !important' }}>
        <DialogContentText id="delete-plate-description" sx={{ overflowWrap: 'anywhere' }}>
          {sucesso ? (
            <>O registro da placa <strong>{placa.codigo}</strong> foi excluído do sistema e a lista de placas foi atualizada. Clique em retornar para visualizar.</>
          ) : (
            <>Tem certeza que deseja excluir a placa <strong>{placa.codigo}</strong>?<br />Esta ação não poderá ser desfeita.</>
          )}
        </DialogContentText>
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: 'wrap' }}>
        {sucesso ? (
          <Button size="large" variant="contained" autoFocus onClick={close}>
            Retornar
          </Button>
        ) : (
          <>
            <Button
              ref={cancelButton}
              size="large"
              variant="outlined"
              color="inherit"
              disabled={submitting}
              onClick={close}
            >
              Cancelar
            </Button>
            <Button
              size="large"
              variant="contained"
              color="error"
              disabled={submitting}
              onClick={() => void confirmar()}
            >
              {submitting ? 'Excluindo…' : 'Sim, excluir'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}