import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';

import { agentesService } from '../../services/agentesService';
import type { Agente } from '../../types/agente';

type FiltroSituacao = 'todos' | 'ativos' | 'inativos';

const ITENS_POR_PAGINA = 8;

interface CardResumoProps {
  valor: number;
  rotulo: string;
  corAvatar: string;
  corIcone: string;
}

function CardResumo({ valor, rotulo, corAvatar, corIcone }: CardResumoProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Avatar sx={{ bgcolor: corAvatar, color: corIcone, width: 56, height: 56 }}>
        <PersonIcon fontSize="large" />
      </Avatar>

      <Box>
        <Typography variant="h6" component="p" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {valor}
        </Typography>
        <Typography color="text.secondary">{rotulo}</Typography>
      </Box>
    </Paper>
  );
}

export function Agentes() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  const [busca, setBusca] = useState('');
  const [situacao, setSituacao] = useState<FiltroSituacao>('todos');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let ativo = true;

    async function carregarAgentes() {
      setLoading(true);
      setErro(null);

      try {
        const resultado = await agentesService.listar();

        if (ativo) {
          setAgentes(resultado);
        }
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os agentes. Tente novamente.');
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregarAgentes();

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const totalAtivos = useMemo(
    () => agentes.filter((a) => a.is_active).length,
    [agentes],
  );
  const totalInativos = agentes.length - totalAtivos;

  const agentesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return agentes.filter((a) => {
      const bateBusca =
        !termo ||
        a.nome.toLowerCase().includes(termo) ||
        a.email.toLowerCase().includes(termo);

      const bateSituacao =
        situacao === 'todos' ||
        (situacao === 'ativos' ? a.is_active : !a.is_active);

      return bateBusca && bateSituacao;
    });
  }, [agentes, busca, situacao]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(agentesFiltrados.length / ITENS_POR_PAGINA),
  );

  const agentesDaPagina = agentesFiltrados.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA,
  );

  function handleCriar() {
    // TODO: abrir formulário / navegar para criação de agente
  }

  function handleEditar(agente: Agente) {
    // TODO: abrir edição do agente
    void agente;
  }

  function handleExcluir(agente: Agente) {
    // TODO: confirmar e excluir o agente
    void agente;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Agente de trânsito
          </Typography>
          <Typography color="text.secondary">
            Gerencie os agentes cadastrados no sistema.
          </Typography>
        </Box>

        <Button
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleCriar}
        >
          Criar agente
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <CardResumo
          valor={totalAtivos}
          rotulo="Agentes ativos"
          corAvatar="#EBC99A"
          corIcone="#C77700"
        />
        <CardResumo
          valor={totalInativos}
          rotulo="Agentes inativos"
          corAvatar="#D9D9D9"
          corIcone="#4D4D4D"
        />
      </Box>


      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          p: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TextField
          placeholder="Buscar por nome, e-mail"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(1);
          }}
          sx={{ maxWidth: 460 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Buscar por nome ou e-mail' },
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
          label="Situação"
          value={situacao}
          onChange={(e) => {
            setSituacao(e.target.value as FiltroSituacao);
            setPagina(1);
          }}
          sx={{ width: 240 }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="ativos">Ativos</MenuItem>
          <MenuItem value="inativos">Inativos</MenuItem>
        </TextField>
      </Paper>

      <Paper
        elevation={0}
        sx={{ bgcolor: '#FFFFFF', borderRadius: 3, overflow: 'hidden' }}
      >
        {loading ? (
          <Box
            role="status"
            sx={{
              minHeight: 240,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress aria-hidden="true" />
            <Typography>Carregando agentes...</Typography>
          </Box>
        ) : erro ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{erro}</Alert>

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setTentativa((valor) => valor + 1)}
            >
              Tentar novamente
            </Button>
          </Box>
        ) : agentes.length === 0 ? (
          <Box role="status" sx={{ py: 8, px: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum agente cadastrado
            </Typography>

            <Typography color="text.secondary">
              Os agentes aparecerão aqui quando forem cadastrados.
            </Typography>
          </Box>
        ) : agentesFiltrados.length === 0 ? (
          <Box role="status" sx={{ py: 8, px: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum resultado encontrado
            </Typography>

            <Typography color="text.secondary">
              Ajuste a busca ou o filtro de situação.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="Agentes cadastrados" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell scope="col" sx={{ fontWeight: 700 }}>Nome</TableCell>
                  <TableCell scope="col" sx={{ fontWeight: 700 }}>E-mail</TableCell>
                  <TableCell scope="col" sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell scope="col" align="center" sx={{ fontWeight: 700 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {agentesDaPagina.map((agente) => (
                  <TableRow key={agente.id} hover>
                    <TableCell component="th" scope="row">
                      {agente.nome}
                    </TableCell>
                    <TableCell>{agente.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={agente.is_active ? 'Ativo' : 'Inativo'}
                        color={agente.is_active ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label={`Editar ${agente.nome}`}
                          onClick={() => handleEditar(agente)}
                          sx={{ color: 'success.main' }}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label={`Excluir ${agente.nome}`}
                          onClick={() => handleExcluir(agente)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {!loading && !erro && agentesFiltrados.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(_, valor) => setPagina(valor)}
            color="primary"
            shape="rounded"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
}