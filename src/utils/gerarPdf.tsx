import { pdf } from '@react-pdf/renderer';
import { RelatorioPlacasPdf } from '../components/relatorios/RelatorioPlacasPdf';
import type { Placa } from '../types/placa';
import type { FiltrosPlacas } from '../services/placasService';

export async function gerarBaixarRelatorioPlacas(placas: Placa[], filtros: FiltrosPlacas) {
  const doc = <RelatorioPlacasPdf placas={placas} filtros={filtros} />;
  const blob = await pdf(doc).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  
  const data = new Date().toISOString().split('T')[0];
  link.download = `relatorio-placas-${data}.pdf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}