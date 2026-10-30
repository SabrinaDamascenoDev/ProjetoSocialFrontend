import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  maxWidth?: number;
}

export function AuthCardLayout({ children, maxWidth = 520 }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'background.default',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: 2,
        py: 4,
      }}
    >
      {/* Onda navy decorativa no rodapé */}
      <Box
        component="svg"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: { xs: '35%', md: '45%' },
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M0,180 C220,60 420,80 620,190 C820,300 1000,320 1180,240 C1300,185 1400,190 1440,210 L1440,400 L0,400 Z"
          fill="#011025"
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(1, 16, 37, 0.08)',
          width: '100%',
          maxWidth,
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}