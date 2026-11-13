import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, IconButton, 
  CircularProgress, Pagination, Box, Typography 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { historicoService } from '../services/historicoPlacaService';
import type { EventoPlacaResponse } from '../types/historico';
import { DetalhesVistoriaDialog } from './DetalheVistoriaDialog';
import { EditRelatorioDialog } from './EditRelatorioDialog';
import './HistoricoDialog.css';

interface HistoricoDialogProps {
  placaId: string;
  open: boolean;
  onClose: () => void;
  enderecoPlaca?: string;
}

function dataFormatada(data: string) {
  return data.slice(0, 10).split('-').reverse().join('/');
}

export function HistoricoDialog({ placaId, open, onClose, enderecoPlaca = 'Endereço não informado' }: HistoricoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [itens, setItens] = useState<EventoPlacaResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoPlacaResponse | null>(null);
  
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<EventoPlacaResponse | null>(null);
  
  const pageSize = 5;

  useEffect(() => {
    if (!open) return;
    let ativo = true;

    async function carregarDados() {
      setLoading(true);
      try {
        const resultado = await historicoService.obterHistorico(placaId, page, pageSize);
        if (ativo) {
          setItens(resultado.items);
          setTotalPages(Math.ceil(resultado.total / resultado.page_size) || 1);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico', error);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarDados();
    return () => { ativo = false; };
  }, [placaId, page, open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="modal-historico-titulo">
        <DialogTitle className="historico-modal-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HistoryIcon color="action" />
            <Box>
              <Typography variant="h6" component="h2" id="modal-historico-titulo">
                Histórico de registros
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acompanhe todas as alterações realizadas nessa placa ao longo do tempo
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} aria-label="Fechar modal" size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="historico-modal-content">
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 2 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="textSecondary">Carregando histórico...</Typography>
            </Box>
          ) : itens.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="textSecondary">Nenhum registro encontrado no histórico desta placa.</Typography>
            </Box>
          ) : (
            <ol className="plate-timeline">
              {itens.map((evento) => (
                <li key={evento.id} onClick={() => setEventoSelecionado(evento)} style={{ cursor: 'pointer' }}>
                  <div className="plate-event-text">
                    <time dateTime={evento.timestamp}>{dataFormatada(evento.timestamp)}</time>
                    <p>
                      <strong>{evento.tipo_evento}</strong> · Conservação: {evento.estado_conservacao}
                    </p>
                    {evento.observacao && <p className="plate-obs">{evento.observacao}</p>}
                    <p>Responsável ID: {evento.created_by}</p>
                  </div>
                  <figure>
                    <div className="plate-event-photo">
                      {evento.foto_url && (
                        <img src={evento.foto_url} alt={`Foto do evento — ${evento.tipo_evento}`} />
                      )}
                    </div>
                    <figcaption>{evento.tipo_evento}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          )}
        </DialogContent>

        <Box component="div" sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, novaPagina) => setPage(novaPagina)} 
            color="primary" 
            size="medium"
            shape='rounded'
            variant='outlined'
            disabled={loading}
          />
        </Box>
      </Dialog>

      <DetalhesVistoriaDialog 
        open={Boolean(eventoSelecionado)}
        onClose={() => setEventoSelecionado(null)}
        evento={eventoSelecionado}
        onEditar={(ev) => {
          setEventoSelecionado(null); // Fecha os detalhes
          setEventoEditando(ev);      // Guarda o evento
          setModalEdicaoAberto(true); // Abre o seu novo modal de edição
        }}
        onExcluir={(ev) => {
          console.log('Excluir evento:', ev.id);
        }}
      />

      {/* O SEU NOVO MODAL DE EDIÇÃO */}
      <EditRelatorioDialog
        open={modalEdicaoAberto}
        onClose={() => setModalEdicaoAberto(false)}
        evento={eventoEditando}
        placaId={placaId}
        enderecoPlaca={enderecoPlaca}
        onSuccess={() => {
          setPage(1); 
        }}
      />
    </>
  );
}