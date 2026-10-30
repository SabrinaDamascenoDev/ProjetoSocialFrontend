import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { AuthCardLayout } from '../../components/recuperar-senha/AuthCardLayout';
import {
  CheckPlainIcon,
  DecorativeIconBox,
} from '../../components/recuperar-senha/icons';

export function SenhaRedefinida() {
  const navigate = useNavigate();

  return (
    <AuthCardLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <DecorativeIconBox bg="#DFF5DC">
          <CheckPlainIcon color="#4CAF50" />
        </DecorativeIconBox>
        <Typography
          sx={{ color: 'text.primary', fontSize: '1.75rem', fontWeight: 800, mb: 1.5 }}
        >
          Nova senha definida!
        </Typography>
        <Typography
          sx={{ color: '#7A7A7A', fontSize: '0.95rem', mb: 3.5, maxWidth: 380 }}
        >
          Retorne a tela inicial para realizar seu login utilizando a sua nova senha.
        </Typography>
        <Button
          onClick={() => navigate('/login', { replace: true })}
          color="secondary"
          sx={{
            width: '100%',
            fontWeight: 800,
            letterSpacing: '0.5px',
            height: 52,
            borderRadius: 1.5,
          }}
        >
          RETORNAR
        </Button>
      </Box>
    </AuthCardLayout>
  );
}