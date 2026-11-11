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
    return (
      <TextField
        id={`edit-plate-${nome}`}
        label={label}
        select={!!opcoes}
        value={dados[nome]}
        disabled={submitting}
        error={!!errors[nome]}
        helperText={errors[nome]}
        onChange={event => alterar(nome, event.target.value)}
        slotProps={opcoes ? { select: { displayEmpty: true }, inputLabel: { shrink: true } } : undefined}
      >
        {opcoes && <MenuItem value="" disabled={!!dadosEdicaoPlaca(placa)[nome]}>Não especificado</MenuItem>}
        {opcoes && Object.entries(opcoes).map(([value, texto]) => <MenuItem key={value} value={value}>{texto}</MenuItem>)}
      </TextField>
    );
  }

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm" aria-labelledby="edit-plate-title"
      slotProps={{ paper: { sx: { bgcolor: '#fff', borderRadius: 3 } } }}>
      <Box component="form" onSubmit={submit} noValidate aria-busy={submitting}>
        <DialogTitle id="edit-plate-title">Editar placa: {placa.codigo}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '12px !important' }}>
          {erroFoto && <Alert severity="error" onClose={() => setErroFoto(null)}>{erroFoto}</Alert>}
          {erro && <Alert severity="error">{erro}</Alert>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar variant="rounded" src={preview ?? placa.foto_url ?? undefined} alt={`Foto da placa ${placa.codigo}`}
              sx={{ width: 96, height: 80, bgcolor: '#fff', color: 'text.secondary', border: '1px solid', borderColor: 'divider', '& img': { objectFit: 'contain' } }}>
              <PhotoCameraOutlinedIcon />
            </Avatar>
            <Button variant="outlined" disabled={submitting} startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => upload.current?.click()}>
              Atualizar foto
            </Button>
            <input ref={upload} type="file" hidden accept={FORMATOS_FOTO.join(',')} disabled={submitting}
              aria-label="Selecionar nova foto da placa" onChange={event => {
                const arquivo = event.target.files?.[0];
                event.target.value = '';
                if (!arquivo) return;
                const erroValidacao = validarFoto(arquivo);
                setErroFoto(erroValidacao);
                if (!erroValidacao) {
                  setFoto(arquivo);
                  setPreview(URL.createObjectURL(arquivo));
                }
              }} />
          </Box>

          <TextField id="edit-plate-code" select label="Código da placa" autoFocus
            value={dados.codigo_contran} disabled={submitting}
            error={!!errors.codigo_contran} helperText={errors.codigo_contran}
            onChange={event => alterar('codigo_contran', event.target.value)}
            slotProps={{ select: { renderValue: value => String(value), MenuProps: { slotProps: { paper: { sx: { maxHeight: 300 } } } } } }}>
            {!codigos.some(item => item.codigo === placa.codigo) && <MenuItem value={placa.codigo}>{placa.codigo}</MenuItem>}
            {codigos.map(item => <MenuItem key={item.codigo} value={item.codigo}>{item.codigo} — {item.descricao}</MenuItem>)}
          </TextField>

          {campo('logradouro', 'Localização (logradouro e número)')}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {campo('tipo_pelicula', 'Tipo de película', PELICULAS)}
            {campo('tipo_substrato', 'Tipo de substrato', SUBSTRATOS)}
            {campo('tipo_suporte', 'Tipo de suporte', SUPORTES)}
            <TextField id="edit-plate-distance" label="Afastamento (m)" type="number"
              value={dados.afastamento} disabled={submitting}
              error={!!errors.afastamento} helperText={errors.afastamento}
              onChange={event => alterar('afastamento', event.target.value)}
              slotProps={{ htmlInput: { min: 0, step: 'any' } }} />
          </Box>
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