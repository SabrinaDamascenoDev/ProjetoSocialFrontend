import { Typography } from '@mui/material';

export function ModulePlaceholder({ title }: { title: string }) {
  return <>
    <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
    <Typography color="text.secondary">Espaço reservado para o módulo. Em desenvolvimento pela equipe.</Typography>
  </>;
}
