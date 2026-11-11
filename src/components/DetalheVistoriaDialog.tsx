import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Button, 
  Box, 
  Typography, 
  Divider,
  Chip,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import type { EventoPlacaResponse } from '../types/historico';
import { coresDoEstado } from '../utils/coresEstadoConservacao';
import './DetalheVistoriaDialog.css';

interface DetalhesVistoriaDialogProps {
  open: boolean;
  onClose: () => void;
  evento: EventoPlacaResponse | null;
  codigoPlaca?: string;
  enderecoPlaca?: string;
  latitude?: number;
  longitude?: number;
  onEditar?: (evento: EventoPlacaResponse) => void;
  onExcluir?: (evento: EventoPlacaResponse) => void;
}

function dataFormatada(data: string) {
  if (!data) return '—';
  return data.slice(0, 10).split('-').reverse().join('/');
}

function nomeEstado(estado?: string | null) {
  if (!estado) return '—';
  const upper = estado.toUpperCase();
  return upper === 'BOM' ? 'Bom' : upper === 'REGULAR' ? 'Regular' : upper === 'RUIM' ? 'Ruim' : estado;
}

function ChipEstado({ estado }: { estado: string | null | undefined }) {
  if (!estado) return <Typography color="text.secondary">—</Typography>;
  const cores = coresDoEstado(estado);

  return (
    <Chip
      size="small"
      label={nomeEstado(estado)}
      sx={{ 
        bgcolor: cores.fundo, 
        color: cores.texto, 
        fontWeight: 600,
        height: 24,
        borderRadius: 1.5,
        px: 0.5
      }}
    />
  );
}

export function DetalhesVistoriaDialog({
  open,
  onClose,
  evento,
  codigoPlaca = 'R-1',
  enderecoPlaca = 'Rua Principal, Centro',
  latitude = -4.9714,
  longitude = -39.0152,
  onEditar,
  onExcluir,
}: DetalhesVistoriaDialogProps) {
  if (!evento) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      aria-labelledby="modal-detalhes-vistoria-titulo"
    >
      <DialogTitle className="vistoria-modal-header" sx={{ display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
        <IconButton onClick={onClose} aria-label="Fechar modal" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="vistoria-modal-content" sx={{ px: 3, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Box className="vistoria-main-photo" sx={{ width: 120, height: 90, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.200', flexShrink: 0 }}>
            {evento.foto_url && (
              <img src={evento.foto_url} alt={`Foto do evento ${evento.tipo_evento}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h6" component="h2" id="modal-detalhes-vistoria-titulo" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {codigoPlaca} · {evento.tipo_evento}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Conservação geral:
              </Typography>
              <ChipEstado estado={evento.estado_conservacao} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Registro: {dataFormatada(evento.timestamp)} · Responsável ID: {evento.created_by}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnOutlinedIcon fontSize="small" /> Localização
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {enderecoPlaca}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latitude: {latitude} · Longitude: {longitude}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, my: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Tipo de película</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: 0.5 }}>Conservação da película</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Refletiva · Tipo I</Typography>
              <ChipEstado estado={evento.estado_pelicula} />
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Tipo de substrato</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: 0.5 }}>Conservação do substrato</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Chapa de aço galvanizado</Typography>
              <ChipEstado estado={evento.estado_substrato} />
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Tipo de suporte</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: 0.5 }}>Conservação do suporte</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Tubo de aço galvanizado</Typography>
              <ChipEstado estado={evento.estado_suporte} />
            </Box>
          </Paper>
        </Box>

        {evento.observacao && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Observações
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {evento.observacao}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={() => onExcluir?.(evento)}
          sx={{ minWidth: 120, borderRadius: 2 }}
        >
          Excluir
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => onEditar?.(evento)}
          sx={{ minWidth: 120, borderRadius: 2, bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}
        >
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
}