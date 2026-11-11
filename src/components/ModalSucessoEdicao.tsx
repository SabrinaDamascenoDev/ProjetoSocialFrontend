import { Dialog, DialogContent, Box, Typography, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ModalSucessoEdicao({ open, onClose }: Props) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      slotProps={{ 
        paper: { 
          sx: { 
            borderRadius: 5, 
            bgcolor: '#D2F4D3', // Cor verde clarinha igual ao print
            p: 2, 
            textAlign: 'center' 
          } 
        } 
      }}
    >
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        
        {/* Quadrado com o Check */}
        <Box 
          sx={{ 
            width: 64, 
            height: 64, 
            borderRadius: 2, 
            bgcolor: '#E8F8E9', // Um verde um pouco mais claro que o fundo
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' // Sombra leve no quadradinho
          }}
        >
          <CheckIcon sx={{ fontSize: 40, color: '#1B7A2F' }} /> {/* Verde escuro */}
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#011025', mt: 1 }}>
          Alterações salvas com sucesso!
        </Typography>
        
        <Typography sx={{ color: '#4A5568', fontSize: '0.95rem', mb: 2, px: 2 }}>
          Retorne à tela das placas de sinalização para visualizar suas alterações.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{ 
            width: 140, 
            height: 40, 
            borderRadius: 1.5,
            fontWeight: 700
          }}
        >
          Retornar
        </Button>

      </DialogContent>
    </Dialog>
  );
}