import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';

import { placasService } from '../../services/placasService';
import type { FiltrosPlacas } from '../../services/placasService';
import type { EstadoConservacao, Placa } from '../../types/placa';

const ITENS_POR_PAGINA = 8;

const TIPOS_PLACA = [
  'R-1', 'R-2', 'R-3', 'R-4a', 'R-4b',
  'R-5a', 'R-5b', 'R-6a', 'R-6b', 'R-6c',
  'R-7', 'R-8a', 'R-8b', 'R-9', 'R-10',
  'R-11', 'R-12', 'R-13', 'R-14', 'R-15',
  'R-16', 'R-17', 'R-18', 'R-19', 'R-20',
  'R-21', 'R-22', 'R-23', 'R-24a', 'R-24b',
  'R-25a', 'R-25b', 'R-25c', 'R-25d', 'R-26',
  'R-27', 'R-28', 'R-29', 'R-30', 'R-31',
  'R-32', 'R-33', 'R-34', 'R-35a', 'R-35b',
  'R-36a', 'R-36b', 'R-37', 'R-38', 'R-39',
  'R-40',

  'A-1a', 'A-1b', 'A-2a', 'A-2b',
  'A-14', 'A-18', 'A-24', 'A-32a', 'A-32b',
  'A-33a', 'A-33b',

  'OUTRO',
];

const ESTADOS: { valor: EstadoConservacao; rotulo: string; fundo: string; texto: string }[] = [
  { valor: 'BOM', rotulo: 'Bom', fundo: '#C8F0D0', texto: '#1B7A2F' },
  { valor: 'REGULAR', rotulo: 'Regular', fundo: '#FFF1B8', texto: '#9A7B00' },
  { valor: 'RUIM', rotulo: 'Ruim', fundo: '#FFD0D0', texto: '#C62828' },
];

const FILTROS_INICIAIS: FiltrosPlacas = {
  busca: '',
  estado: 'todos',
  codigo_contran: 'todos',
  dataInicio: '',
  dataFim: '',
};

function formatarData(iso: string) {
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

function ChipEstado({ estado }: { estado: EstadoConservacao | null }) {
  if (!estado) return <Typography color="text.secondary">—</Typography>;

  const config = ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[1];

  return (
    <Chip
      size="small"
      label={config.rotulo}
      sx={{ bgcolor: config.fundo, color: config.texto, fontWeight: 600 }}
    />
  );
}

export function Placas() {
  const navigate = useNavigate();

  const [placas, setPlacas] = useState<Placa[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosPlacas>(FILTROS_INICIAIS);
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscaDebounced(filtros.busca);
      setPagina(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filtros.busca]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setLoading(true);
      setErro(null);

      try {
        const resultado = await placasService.listar(pagina, ITENS_POR_PAGINA, {
          ...filtros,
          busca: buscaDebounced,
        });

        if (ativo) {
          setPlacas(resultado.items);
          setTotal(resultado.total);
        }

      } catch {
        if (ativo) setErro('Não foi possível carregar as placas. Tente novamente.');
      } finally {
        if (ativo) setLoading(false);
      }
    }

    void carregar();

    return () => {
      ativo = false;
    };
  }, [pagina, buscaDebounced, filtros.estado, filtros.codigo_contran, filtros.dataInicio, filtros.dataFim, tentativa]);

  const totalPaginas = Math.max(1, Math.ceil(total / ITENS_POR_PAGINA));

  function alterarFiltro<K extends keyof FiltrosPlacas>(campo: K, valor: FiltrosPlacas[K]) {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
    if (campo !== 'busca') setPagina(1);
  }

  const todasDaPaginaSelecionadas =
    placas.length > 0 && placas.every((p) => selecionadas.has(p.id));
  const algumasDaPaginaSelecionadas =
    placas.some((p) => selecionadas.has(p.id)) && !todasDaPaginaSelecionadas;

  function alternarTodasDaPagina() {
    setSelecionadas((atuais) => {
      const novo = new Set(atuais);
      placas.forEach((p) => (todasDaPaginaSelecionadas ? novo.delete(p.id) : novo.add(p.id)));
      return novo;
    });
  }

  function alternarUma(id: string) {
    setSelecionadas((atuais) => {
      const novo = new Set(atuais);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function abrirDetalhes(placa: Placa) {
    navigate(`/placas/${placa.id}`);
  }

  function handleEditar(e: MouseEvent, placa: Placa) {
    e.stopPropagation();
    navigate(`/placas/${placa.id}/editar`); 
  }

  function handleGerarRelatorio() {
    // TODO: gerar PDF com os dados da listagem (outra task)
  }

  function handleExcluir(e: MouseEvent, _placa: Placa) {
    e.stopPropagation();
    // TODO: abrir dialog de confirmação de exclusão (outra task)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Placas de Sinalização
        </Typography>
        <Typography color="text.secondary">
          Visualize, filtre e consulte as placas cadastradas no sistema.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          p: 3,
          mb: 3,
          '& .MuiOutlinedInput-root': { height: 48 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            label="Buscar placa"
            placeholder="Buscar por código, rua ou bairro"
            value={filtros.busca}
            onChange={(e) => alterarFiltro('busca', e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 260 }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { 'aria-label': 'Buscar por código, rua ou bairro' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            size="small"
            label="Estados de conservação"
            value={filtros.estado}
            onChange={(e) => alterarFiltro('estado', e.target.value as FiltrosPlacas['estado'])}
            sx={{ width: 220 }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {ESTADOS.map((e) => (
              <MenuItem key={e.valor} value={e.valor}>
                {e.rotulo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Tipo de placa"
            value={filtros.codigo_contran}
            onChange={(e) => alterarFiltro('codigo_contran', e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {TIPOS_PLACA.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <Button
            color="secondary"
            startIcon={<DescriptionIcon />}
            onClick={handleGerarRelatorio}
            sx={{ height: 48 }}
          >
            Gerar relatório
          </Button>
        </Box>
      </Paper>

      {/* Tabela */}
      <Paper elevation={0} sx={{ bgcolor: '#FFFFFF', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box
            role="status"
            sx={{
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress aria-hidden="true" />
            <Typography>Carregando placas...</Typography>
          </Box>
        ) : erro ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{erro}</Alert>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setTentativa((v) => v + 1)}>
              Tentar novamente
            </Button>
          </Box>
        ) : placas.length === 0 ? (
          <Box role="status" sx={{ py: 8, px: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhuma placa encontrada
            </Typography>
            <Typography color="text.secondary">
              Ajuste a busca ou os filtros para ver outros resultados.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="Placas de sinalização cadastradas" sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={todasDaPaginaSelecionadas}
                      indeterminate={algumasDaPaginaSelecionadas}
                      onChange={alternarTodasDaPagina}
                      slotProps={{ input: { 'aria-label': 'Selecionar todas as placas da página' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Foto</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Localização</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado de conservação</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Película</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Substrato</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Suporte</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Data de registro</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {placas.map((placa) => {
                  const marcada = selecionadas.has(placa.id);

                  return (
                    <TableRow
                      key={placa.id}
                      hover
                      selected={marcada}
                      onClick={() => abrirDetalhes(placa)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target === e.currentTarget) abrirDetalhes(placa);
                      }}
                      tabIndex={0}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={marcada}
                          onChange={() => alternarUma(placa.id)}
                          slotProps={{ input: { 'aria-label': `Selecionar placa ${placa.codigo}` } }}
                        />
                      </TableCell>

                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={placa.foto_url ?? undefined}
                          alt={`Foto da placa ${placa.codigo}`}
                          sx={{ width: 56, height: 56, bgcolor: 'grey.200' }}
                        />
                      </TableCell>

                      <TableCell>{placa.codigo}</TableCell>

                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography variant="body2">{placa.endereco}</Typography>
                      </TableCell>

                      <TableCell>
                        <ChipEstado estado={placa.estado_conservacao} />
                      </TableCell>

                      <TableCell align="center">
                        <ChipEstado estado={placa.pelicula} />
                      </TableCell>
                      <TableCell align="center">
                        <ChipEstado estado={placa.substrato} />
                      </TableCell>
                      <TableCell align="center">
                        <ChipEstado estado={placa.suporte} />
                      </TableCell>

                      <TableCell>{formatarData(placa.data_registro)}</TableCell>

                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Editar">
                          <IconButton
                            aria-label={`Editar placa ${placa.codigo}`}
                            onClick={(e) => handleEditar(e, placa)}
                            sx={{ width: 44, height: 44 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            aria-label={`Excluir placa ${placa.codigo}`}
                            onClick={(e) => handleExcluir(e, placa)}
                            sx={{ width: 44, height: 44 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          alignSelf: 'flex-end',
        }}
      >
        {selecionadas.size > 0 && (
          <Typography role="status" color="text.secondary">
            {selecionadas.size} {selecionadas.size === 1 ? 'placa selecionada' : 'placas selecionadas'}
          </Typography>
        )}

        {!loading && !erro && total > 0 && (
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(_, valor) => setPagina(valor)}
            color="primary"
            shape="rounded"
            variant="outlined"
            showFirstButton={false}
          />
        )}
      </Box>
    </Box>
  );
}