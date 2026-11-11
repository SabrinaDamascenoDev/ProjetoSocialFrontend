import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, Button, TextField, Box,
  Typography, CircularProgress, InputLabel, FormControl, Select,
  MenuItem, ToggleButton, ToggleButtonGroup, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { historicoService } from '../services/historicoPlacaService';
import type { EventoPlacaResponse } from '../types/historico';

interface Props {
  open: boolean;
  onClose: () => void;
  evento: EventoPlacaResponse | null;
  placaId: string;
  enderecoPlaca: string;
  onSuccess: () => void;
}

export function EditRelatorioDialog({ open, onClose, evento, placaId, enderecoPlaca, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    localizacao: '',
    estado_conservacao: 'BOM',
    estado_pelicula: 'BOM',
    estado_substrato: 'BOM',
    estado_suporte: 'BOM',
    observacao: ''
  });

  useEffect(() => {
    if (evento && open) {
      setFormData({
        localizacao: enderecoPlaca || 'Endereço não informado',
        estado_conservacao: evento.estado_conservacao || 'BOM',
        estado_pelicula: evento.estado_pelicula || 'BOM',
        estado_substrato: evento.estado_substrato || 'BOM',
        estado_suporte: evento.estado_suporte || 'BOM',
        observacao: evento.observacao || ''
      });
      setPreview(evento.foto_url ?? null);
      setFoto(null);
    }
  }, [evento, open, enderecoPlaca]);

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
    if (!evento) return;

    try {
      setLoading(true);
      const data = new FormData();
      
      if (foto) data.append('foto', foto);
      data.append('localizacao', formData.localizacao);
      data.append('estado_conservacao', formData.estado_conservacao);
      data.append('estado_pelicula', formData.estado_pelicula);
      data.append('estado_substrato', formData.estado_substrato);
      data.append('estado_suporte', formData.estado_suporte);
      data.append('observacao', formData.observacao);

      await historicoService.atualizarEvento(placaId, evento.id, data);
      
      toast.success('Relatório atualizado com sucesso!', toastOptions);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar alterações. Tente novamente.', toastOptions);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderBottom: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
        <IconButton onClick={onClose} size="small"><ArrowBackIcon /></IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#011025' }}>
          Editar relatório
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: '#F3F4F6' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          
          {/* Foto */}
          <Box sx={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ border: '2px dashed #D1D5DB', borderRadius: 2, bgcolor: '#FFF', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, minHeight: 220, position: 'relative', overflow: 'hidden' }}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
              ) : (
                <>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: '#374151' }}>Adicionar foto</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mb: 2 }}>JPG ou PNG</Typography>
                </>
              )}
              <Button component="label" variant="contained" size="small" sx={{ bgcolor: preview ? 'rgba(0,0,0,0.6)' : '#011025', color: '#fff', mt: preview ? 0 : 1, position: preview ? 'absolute' : 'relative', zIndex: 2 }}>
                Selecionar foto
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Box>
          </Box>

          {/* Localização e Estado Geral */}
          <Box sx={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1, color: '#374151' }}>Localização</Typography>
              <TextField value={formData.localizacao} onChange={(e) => handleChange('localizacao', e.target.value)} size="small" fullWidth />
            </Box>

            <Box sx={{ bgcolor: '#FFF', p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1, color: '#374151' }}>Estado geral de conservação</Typography>
              <ToggleButtonGroup value={formData.estado_conservacao} exclusive onChange={(_, val) => val && handleChange('estado_conservacao', val)} fullWidth sx={{ gap: 1 }}>
                <ToggleButton value="RUIM" sx={{ border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 1, '&.Mui-selected': { bgcolor: '#FEF2F2', borderColor: '#DC2626', color: '#DC2626', fontWeight: 700 } }}>Ruim</ToggleButton>
                <ToggleButton value="REGULAR" sx={{ border: '1px solid #FDBA74', color: '#EA580C', borderRadius: 1, '&.Mui-selected': { bgcolor: '#FFF7ED', borderColor: '#EA580C', color: '#EA580C', fontWeight: 700 } }}>Regular</ToggleButton>
                <ToggleButton value="BOM" sx={{ border: '1px solid #86EFAC', color: '#16A34A', borderRadius: 1, '&.Mui-selected': { bgcolor: '#F0FDF4', borderColor: '#16A34A', color: '#16A34A', fontWeight: 700 } }}>Bom</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Conservação dos Componentes */}
          <Box sx={{ flex: '1 1 45%', bgcolor: '#FFF', p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1, color: '#374151' }}>Conservação dos componentes</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['pelicula', 'substrato', 'suporte'].map((comp) => (
                <FormControl key={comp} fullWidth size="small">
                  <InputLabel sx={{ textTransform: 'capitalize' }}>{comp}</InputLabel>
                  <Select value={(formData as any)[`estado_${comp}`]} label={comp} onChange={(e) => handleChange(`estado_${comp}`, e.target.value)}>
                    <MenuItem value="BOM">Bom</MenuItem>
                    <MenuItem value="REGULAR">Regular</MenuItem>
                    <MenuItem value="RUIM">Ruim</MenuItem>
                  </Select>
                </FormControl>
              ))}
            </Box>
          </Box>

          {/* Dados de Registro (Read Only) */}
          <Box sx={{ flex: '1 1 45%', bgcolor: '#FFF', p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1, color: '#374151' }}>Dados de registro</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                label="Data do registro" 
                value={evento ? new Date(evento.timestamp).toLocaleDateString('pt-BR') : ''} 
                size="small" 
                fullWidth 
                disabled // Read-only visual
              />
              <TextField 
                label="Agente responsável" 
                value={evento ? `Usuário #${evento.created_by}` : ''} 
                size="small" 
                fullWidth 
                disabled // Read-only visual
              />
            </Box>
          </Box>

          {/* Observações */}
          <Box sx={{ flex: '1 1 100%', bgcolor: '#FFF', p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1, color: '#374151' }}>Observações</Typography>
            <TextField multiline rows={3} value={formData.observacao} onChange={(e) => handleChange('observacao', e.target.value)} fullWidth size="small" />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>Cancelar</Button>
        <Button onClick={handleSalvar} variant="contained" color="primary" disabled={loading} sx={{ bgcolor: '#011025' }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar relatório'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}