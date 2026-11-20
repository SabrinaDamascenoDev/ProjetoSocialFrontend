import { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper, Skeleton, Typography } from '@mui/material';
import { perfilRepository } from '../../repositories/perfilRepository';
import type { PerfilUsuario } from '../../types/perfil';
import { useAuth } from '../../contexts/AuthContext';
import './MeuPerfil.css';

type Estado =
  | { status: 'carregando' }
  | { status: 'erro' }
  | { status: 'sucesso'; perfil: PerfilUsuario };

export function MeuPerfil() {
  const { userId } = useAuth();
  return <ConteudoPerfil key={userId} />;
}

function ConteudoPerfil() {
  const [estado, setEstado] = useState<Estado>({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    perfilRepository.obter(controller.signal).then(
      (perfil) => {
        if (!controller.signal.aborted) setEstado({ status: 'sucesso', perfil });
      },
      () => {
        if (!controller.signal.aborted) setEstado({ status: 'erro' });
      },
    );
    return () => controller.abort();
  }, [tentativa]);

  const perfil = estado.status === 'sucesso' ? estado.perfil : null;
  const dataCadastro = perfil?.created_at ? new Date(perfil.created_at) : null;
  const dataFormatada = dataCadastro && !Number.isNaN(dataCadastro.getTime())
    ? new Intl.DateTimeFormat('pt-BR').format(dataCadastro)
    : '—';
  const campos = [
    { titulo: 'Nome completo', valor: perfil?.nome },
    { titulo: 'E-mail', valor: perfil?.email },
    { titulo: 'Tipo de usuário', valor: perfil?.role === 'ADMINISTRADOR' ? 'Administrador' : perfil?.role === 'AGENTE' ? 'Agente' : '—' },
    { titulo: 'Data de cadastro', valor: dataFormatada },
  ];

  function tentarNovamente() {
    setEstado({ status: 'carregando' });
    setTentativa((valor) => valor + 1);
  }

  return (
    <Box className="profile-page">
      <header className="profile-header">
        <Typography component="h1" className="profile-title">Meu perfil</Typography>
        <Typography className="profile-subtitle">Visualize suas informações</Typography>
      </header>
      <div className="profile-body">
      <Paper component="section" aria-labelledby="informacoes-pessoais" elevation={0}
        className="profile-card">
        <Typography id="informacoes-pessoais" component="h2" className="profile-card-title">
          Informações pessoais
        </Typography>
        {estado.status === 'erro' ? (
          <Alert severity="error" action={<Button variant="text" color="inherit" onClick={tentarNovamente} sx={{ height: 'auto', fontSize: '1rem' }}>Tentar novamente</Button>}>
            Não foi possível carregar seu perfil.
          </Alert>
        ) : (
          <Box component="dl" aria-busy={estado.status === 'carregando'}
            aria-label={estado.status === 'carregando' ? 'Carregando informações pessoais' : undefined}
            className="profile-fields">
            {campos.map(({ titulo, valor }) => (
              <Box component="div" key={titulo} className="profile-field">
                <Typography component="dt" className="profile-label">{titulo}:</Typography>
                <Box component="dd" className="profile-value">
                  {estado.status === 'carregando' ? <Skeleton width="100%" /> : valor}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
      </div>
    </Box>
  );
}
