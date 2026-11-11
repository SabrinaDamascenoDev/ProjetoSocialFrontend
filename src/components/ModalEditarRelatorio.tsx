import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Box, Avatar, Typography, CircularProgress,
  InputLabel, FormControl, Select
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { placasService } from '../services/placasService';
import type { Placa } from '../types/placa';

interface Props {
  open: boolean;
  onClose: () => void;
  placa: Placa | null;
  onSuccess: () => void;
}

const TIPOS = ['TIPO I', 'TIPO II', 'TIPO III', 'TIPO IV', 'Não especificado'];
const ESTADOS = [
  { valor: 'BOM', rotulo: 'Bom' },
  { valor: 'REGULAR', rotulo: 'Regular' },
  { valor: 'RUIM', rotulo: 'Ruim' },
];

export function ModalEditarRelatorio({ open, onClose, placa, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    localizacao: '',
    tipo_pelicula: 'Não especificado',
    tipo_substrato: 'Não especificado',
    tipo_suporte: 'Não especificado',
    afastamento: 0,
    estado_conservacao: 'BOM',
    estado_pelicula: 'BOM',
    estado_substrato: 'BOM',
    estado_suporte: 'BOM',
    observacao: ''
  });

  // Preenche o form quando o modal abrir
  useEffect(() => {
    if (placa && open) {
      setFormData({
        localizacao: placa.endereco,
        tipo_pelicula: 'Não especificado',
        tipo_substrato: 'Não especificado',
        tipo_suporte: 'Não especificado',
        afastamento: 0,
        estado_conservacao: placa.estado_conservacao || 'BOM',
        estado_pelicula: placa.pelicula || 'BOM',
        estado_substrato: placa.substrato || 'BOM',
        estado_suporte: placa.suporte || 'BOM',
        observacao: ''
      });
      setPreview(placa.foto_url);
      setFoto(null);
    }
  }, [placa, open]);

  function handleChange(campo: string, valor: any) {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSalvar() {
    if (!placa || !placa.evento_id) {
      toast.error('ID do relatório não encontrado.', toastOptions);
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      if (foto) data.append('foto', foto);
      data.append('localizacao', formData.localizacao);
      data.append('afastamento', String(formData.afastamento));
      data.append('tipo_pelicula', formData.tipo_pelicula);
      data.append('tipo_substrato', formData.tipo_substrato);
      data.append('tipo_suporte', formData.tipo_suporte);
      data.append('estado_conservacao', formData.estado_conservacao);
      data.append('estado_pelicula', formData.estado_pelicula);
      data.append('estado_substrato', formData.estado_substrato);
      data.append('estado_suporte', formData.estado_suporte);
      data.append('observacao', formData.observacao);

      await placasService.atualizarEvento(placa.id, placa.evento_id, data);
      
      onSuccess(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar alterações. Tente novamente.', toastOptions);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
      <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.4rem' }}>
        Editar Dados da placa: {placa?.codigo}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          
          {/* Coluna 1: Foto */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar 
              variant="rounded" 
              src={preview || undefined} 
              sx={{ width: 100, height: 100, bgcolor: 'grey.200', border: '1px solid #ccc' }} 
            />
            <Button 
              component="label" 
              variant="outlined" 
              size="small"
              startIcon={<PhotoCameraIcon />}
              sx={{ textTransform: 'none' }}
            >
              Atualizar Foto
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>

          {/* Coluna 2: Formulário */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Código da Placa"
              value={placa?.codigo || ''}
              disabled
              size="small"
              fullWidth
            />
            <TextField
              label="Localização"
              value={formData.localizacao}
              onChange={(e) => handleChange('localizacao', e.target.value)}
              size="small"
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Película</InputLabel>
                <Select value={formData.tipo_pelicula} label="Tipo de Película" onChange={(e) => handleChange('tipo_pelicula', e.target.value)}>
                  {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Substrato</InputLabel>
                <Select value={formData.tipo_substrato} label="Tipo de Substrato" onChange={(e) => handleChange('tipo_substrato', e.target.value)}>
                  {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Suporte</InputLabel>
                <Select value={formData.tipo_suporte} label="Tipo de Suporte" onChange={(e) => handleChange('tipo_suporte', e.target.value)}>
                  {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Afastamento"
                type="number"
                value={formData.afastamento}
                onChange={(e) => handleChange('afastamento', e.target.value)}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        </Box>

        {/* Linha de Estados de Conservação */}
        <Typography sx={{ fontWeight: 700, mt: 3, mb: 1, fontSize: '0.9rem', color: 'text.secondary' }}>Estados de Conservação</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
            <InputLabel>Geral</InputLabel>
            <Select value={formData.estado_conservacao} label="Geral" onChange={(e) => handleChange('estado_conservacao', e.target.value)}>
              {ESTADOS.map(e => <MenuItem key={e.valor} value={e.valor}>{e.rotulo}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
            <InputLabel>Película</InputLabel>
            <Select value={formData.estado_pelicula} label="Película" onChange={(e) => handleChange('estado_pelicula', e.target.value)}>
              {ESTADOS.map(e => <MenuItem key={e.valor} value={e.valor}>{e.rotulo}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
            <InputLabel>Substrato</InputLabel>
            <Select value={formData.estado_substrato} label="Substrato" onChange={(e) => handleChange('estado_substrato', e.target.value)}>
              {ESTADOS.map(e => <MenuItem key={e.valor} value={e.valor}>{e.rotulo}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
            <InputLabel>Suporte</InputLabel>
            <Select value={formData.estado_suporte} label="Suporte" onChange={(e) => handleChange('estado_suporte', e.target.value)}>
              {ESTADOS.map(e => <MenuItem key={e.valor} value={e.valor}>{e.rotulo}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Observações"
          multiline
          rows={3}
          value={formData.observacao}
          onChange={(e) => handleChange('observacao', e.target.value)}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
        />

      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSalvar} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}