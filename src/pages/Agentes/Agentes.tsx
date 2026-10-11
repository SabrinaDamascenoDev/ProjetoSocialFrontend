import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { agentesService } from '../../services/agentesService';
import type { Agente } from '../../types/agente';

export function Agentes() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: 700, mb: 1 }}
      >
        Agentes cadastrados
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Consulte os agentes cadastrados no sistema.
      </Typography>

      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: 'hidden' }}
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
          <Box
            role="status"
            sx={{ py: 8, px: 3, textAlign: 'center' }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Nenhum agente cadastrado
            </Typography>

            <Typography color="text.secondary">
              Os agentes aparecerão aqui quando forem cadastrados.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              color="text.secondary"
              sx={{ px: 2, py: 2 }}
            >
              Total de agentes: {agentes.length}
            </Typography>

            <TableContainer>
              <Table
                aria-label="Agentes cadastrados"
                sx={{ minWidth: 480 }}
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell scope="col" sx={{ fontWeight: 700 }}>
                      Nome
                    </TableCell>
                    <TableCell scope="col" sx={{ fontWeight: 700 }}>
                      E-mail
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {agentes.map((agente) => (
                    <TableRow key={agente.id} hover>
                      <TableCell component="th" scope="row">
                        {agente.nome}
                      </TableCell>
                      <TableCell>{agente.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
  );
}