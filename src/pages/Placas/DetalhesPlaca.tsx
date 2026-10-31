import { useEffect, useState } from 'react';
import { placasService } from '../../services/placasService';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Alert, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import EditNoteIcon from '@mui/icons-material/EditNote';
import type { DetalhesPlaca as DadosDetalhes } from '../../types/detalhesPlaca';
import type { EstadoConservacao } from '../../types/placa';
import './DetalhesPlaca.css';

function dataFormatada(data: string) {
  return data.slice(0, 10).split('-').reverse().join('/');
}

function nomeEstado(estado: EstadoConservacao | null) {
  return estado === 'BOM' ? 'Bom' : estado === 'REGULAR' ? 'Regular' : estado === 'RUIM' ? 'Ruim' : '—';
}

function Avaliacao({ titulo, estado }: { titulo: string; estado: EstadoConservacao | null }) {
  return <div className="plate-rating">
    <span>{titulo}</span>
    <span className={`plate-status plate-status-${estado?.toLowerCase() ?? 'unknown'}`}>{nomeEstado(estado)}</span>
  </div>;
}

export function ConteudoDetalhesPlaca({ dados }: { dados: DadosDetalhes }) {
  const { placa } = dados;
  return <div className="plate-details-grid">
    <section className="plate-details-card" aria-label="Resumo da placa">
      <div className="plate-summary">
        <div className="plate-main-photo">
          {placa.foto_url && <img src={placa.foto_url} alt={`Placa ${placa.codigo}`} />}
        </div>
        <div>
          <div className="plate-summary-title"><h2>Placa {placa.codigo}</h2><span className={`plate-status plate-status-${placa.estado_conservacao?.toLowerCase() ?? "unknown"}`}>{nomeEstado(placa.estado_conservacao)}</span></div>
          <p>Código {placa.codigo}</p>
          <p className="plate-icon-line"><LocationOnOutlinedIcon /><span>{placa.endereco}</span></p>
        </div>
      </div>
      <hr />
      <h2>Informações gerais</h2>
      <Avaliacao titulo="Estado de conservação" estado={placa.estado_conservacao} />
      <Avaliacao titulo="Película" estado={placa.pelicula} />
      <Avaliacao titulo="Substrato" estado={placa.substrato} />
      <Avaliacao titulo="Suporte" estado={placa.suporte} />
      <div className="plate-metadata">
        <p className="plate-icon-line"><CalendarMonthOutlinedIcon />Data de registro: {dataFormatada(placa.data_registro)}</p>
        <p className="plate-icon-line"><PersonOutlineIcon />Agente responsável: {dados.responsavel}</p>
      </div>
    </section>
    <section className="plate-details-card" aria-label="Dados técnicos e histórico">
      <h2>Informações adicionais</h2>
      <dl className="plate-technical">
        {[
          ['Código da placa', placa.codigo], ['Afastamento', dados.afastamento],
          ['Tipo de película', dados.tipoPelicula], ['Tipo de substrato', dados.tipoSubstrato],
          ['Tipo de suporte', dados.tipoSuporte],
          ['Estado de conservação da película', nomeEstado(placa.pelicula)],
          ['Estado de conservação do substrato', nomeEstado(placa.substrato)],
          ['Estado de conservação do suporte', nomeEstado(placa.suporte)],
        ].map(([label, valor]) => <div key={label}><dt>{label}: </dt><dd>{valor}</dd></div>)}
      </dl>
      {dados.observacoes && <>
        <h2 className="plate-section-title"><EditNoteIcon />Observações</h2>
        <p>{dados.observacoes}</p>
      </>}
      <h2 className="plate-section-title"><HistoryIcon />Histórico de registros</h2>
      <p>Último registro</p>
      {dados.historico.length === 0 ? null : <ol className="plate-timeline">
        {dados.historico.map((registro) => <li key={registro.id}>
          <div className="plate-event-text">
            <time dateTime={registro.data}>{dataFormatada(registro.data)}</time>
            <p>{registro.tipo} · {registro.descricao}</p>
            <p>Responsável: {registro.responsavel}</p>
          </div>
          <figure>
            <div className="plate-event-photo">
              {registro.fotoUrl && <img src={registro.fotoUrl} alt={`Foto da placa — ${registro.tipo}`} />}
            </div>
            <figcaption>{registro.tipo}</figcaption>
          </figure>
        </li>)}
      </ol>}
    </section>
  </div>;
}

export function DetalhesPlaca() {
  const { id } = useParams();
  const [dados, setDados] = useState<DadosDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setLoading(true);
      setErro(false);
      try {
        const resultado = id ? await placasService.obterDetalhes(id) : null;
        if (ativo) setDados(resultado);
      } catch {
        if (ativo) setErro(true);
      } finally {
        if (ativo) setLoading(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, [id, tentativa]);

  return <div className="plate-details">
    <header className="plate-details-header">
      <Link to="/placas" aria-label="Voltar para a listagem de placas" className="plate-back"><ArrowBackIcon /></Link>
      <h1>Detalhes da Placa</h1>
    </header>
    {loading ? <div role="status"><CircularProgress size={28} /> Carregando placa...</div>
      : erro ? <Alert severity="error" action={<Button variant="text" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</Button>}>Não foi possível carregar a placa.</Alert>
      : dados ? <ConteudoDetalhesPlaca dados={dados} />
      : <Navigate to="/placas" replace />}
  </div>;
}
