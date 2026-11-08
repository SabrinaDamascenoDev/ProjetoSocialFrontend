import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { toast } from 'sonner';
import { toastOptions } from '../lib/toastOptions';
import { placasService } from '../services/placasService';
import type { Placa, Tipos } from '../types/placa';
import { dadosEdicaoPlaca, FORMATOS_FOTO, PELICULAS, SUBSTRATOS, SUPORTES, validarEdicaoPlaca, validarFoto, type EdicaoPlaca } from '../utils/edicaoPlaca';

interface Props {
  placa: Placa;
  codigos: Tipos[];
  onClose: () => void;
  onSaved: (placa: Placa) => void;
}

export function EditPlateDialog({ placa, codigos, onClose, onSaved }: Props) {
  const [dados, setDados] = useState(() => dadosEdicaoPlaca(placa));
  const [errors, setErrors] = useState<Partial<Record<keyof EdicaoPlaca, string>>>({});
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const upload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function alterar(campo: keyof EdicaoPlaca, valor: string) {
    setDados(current => ({ ...current, [campo]: valor }));
    setErrors(current => ({ ...current, [campo]: undefined }));
  }

  function close() { if (!pending.current) onClose(); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const invalidos = validarEdicaoPlaca(placa, dados);
    setErrors(invalidos);
    if (Object.keys(invalidos).length || erroFoto) return;
    pending.current = true;
    setSubmitting(true);
    setErro(null);
    try {
      const atualizada = await placasService.editar(placa, dados, foto);
      toast.success('Dados da placa atualizados com sucesso!', toastOptions);
      onSaved(atualizada);
    } catch {
      setErro('Erro ao atualizar os dados da placa.');
      toast.error('Erro ao atualizar os dados da placa.', toastOptions);
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  function campo(nome: keyof EdicaoPlaca, label: string, opcoes?: Record<string, string>) {
    return <TextField id={`edit-plate-${nome}`} label={label} size="small" select={!!opcoes}
      value={dados[nome]} disabled={submitting} error={!!errors[nome]} helperText={errors[nome]}
      onChange={event => alterar(nome, event.target.value)}
      slotProps={{ inputLabel: { shrink: true }, ...(opcoes ? { select: { displayEmpty: true } } : {}) }}>
      {opcoes && <MenuItem value="" disabled={!!dadosEdicaoPlaca(placa)[nome]}>Não especificado</MenuItem>}
      {opcoes && Object.entries(opcoes).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
    </TextField>;
  }

  return (
    <Dialog open onClose={close} fullWidth maxWidth={false} aria-labelledby="edit-plate-title"
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(1, 16, 37, .50)' } }, paper: { sx: {
        bgcolor: '#fff', borderRadius: { xs: '24px', sm: '38px' }, width: 476,
        m: 2, maxWidth: 'calc(100% - 32px)',
      } } }}>
      <Box component="form" onSubmit={submit} noValidate aria-busy={submitting}
        sx={{ px: { xs: 2.5, sm: 4 }, pt: 1.5, pb: { xs: 3, sm: 7 },
          '& .MuiOutlinedInput-root': { bgcolor: '#fff', fontSize: 12, borderRadius: '6px' },
          '& .MuiInputLabel-root': { fontSize: 14 },
          '& .MuiButton-root': { fontSize: 12, minHeight: 36, height: 'auto', borderRadius: '6px' },
        }}>
        <DialogTitle id="edit-plate-title" sx={{ p: 0, pb: 1.5, fontSize: { xs: 19, sm: 20 }, fontWeight: 600 }}>
          Editar Dados da placa: {placa.codigo}
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'visible', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar variant="rounded" src={preview ?? placa.foto_url ?? undefined} alt={`Foto da placa ${placa.codigo}`}
              sx={{ width: 76, height: 64, bgcolor: '#fff', color: 'text.secondary', border: '1px solid #888', '& img': { objectFit: 'contain' } }}>
              <PhotoCameraOutlinedIcon />
            </Avatar>
            <Button autoFocus variant="contained" disabled={submitting} startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => upload.current?.click()} sx={{ bgcolor: '#a5abb5', color: '#000', border: '1px solid #747983', '&:hover': { bgcolor: '#9299a4' } }}>
              Atualizar Foto
            </Button>
            <input ref={upload} type="file" hidden accept={FORMATOS_FOTO.join(',')} disabled={submitting}
              aria-label="Selecionar nova foto da placa" onChange={event => {
                const arquivo = event.target.files?.[0];
                event.target.value = '';
                if (!arquivo) return;
                const erro = validarFoto(arquivo);
                setErroFoto(erro);
                if (!erro) {
                  setFoto(arquivo);
                  setPreview(URL.createObjectURL(arquivo));
                }
              }} />
          </Box>
          {erroFoto && <Alert severity="error" onClose={() => setErroFoto(null)}>{erroFoto}</Alert>}
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField id="edit-plate-code" select label="Código da Placa" size="small" value={dados.codigo_contran}
            disabled={submitting} error={!!errors.codigo_contran} helperText={errors.codigo_contran}
            onChange={event => alterar('codigo_contran', event.target.value)}
            slotProps={{ inputLabel: { shrink: true }, select: { renderValue: value => String(value), MenuProps: { slotProps: { paper: { sx: { maxHeight: 300 } } } } } }}>
            {!codigos.some(item => item.codigo === placa.codigo) && <MenuItem value={placa.codigo}>{placa.codigo}</MenuItem>}
            {codigos.map(item => <MenuItem key={item.codigo} value={item.codigo}>{item.codigo} — {item.descricao}</MenuItem>)}
          </TextField>
          {campo('logradouro', 'Localização (logradouro e número)')}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, minmax(0, 1fr))' }, columnGap: 1, rowGap: 3,
            '& .MuiInputLabel-root': { fontSize: 10, transform: 'translate(0, -16px)', maxWidth: '100%' },
            '& legend': { display: 'none' },
            '& .MuiOutlinedInput-notchedOutline': { top: 0 },
            '& .MuiSelect-select': { fontSize: { xs: 12, sm: 10 }, pl: 0.5, pr: '18px !important' },
            '& .MuiSelect-icon': { right: 0 },
          }}>
            {campo('tipo_pelicula', 'Tipo de Película', PELICULAS)}
            {campo('tipo_substrato', 'Tipo de Substrato', SUBSTRATOS)}
            {campo('tipo_suporte', 'Tipo de Suporte', SUPORTES)}
            <TextField id="edit-plate-distance" label="Afastamento (m)" size="small" type="number"
              value={dados.afastamento} disabled={submitting} error={!!errors.afastamento} helperText={errors.afastamento}
              onChange={event => alterar('afastamento', event.target.value)}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: 0, step: 'any' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 0, pt: 5, justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button disabled={submitting} onClick={close} sx={{ minWidth: 108, bgcolor: '#a5abb5', color: '#000', border: '1px solid #747983', '&:hover': { bgcolor: '#9299a4' } }}>Cancelar</Button>
          <Button type="submit" disabled={submitting} sx={{ minWidth: 148 }}>{submitting ? 'Salvando…' : 'Salvar Alterações'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
