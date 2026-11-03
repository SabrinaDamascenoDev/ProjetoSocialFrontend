import { pdf } from '@react-pdf/renderer';
import { RelatorioPlacasPdf } from '../components/relatorios/RelatorioPlacasPdf';
import type { Placa } from '../types/placa';
import type { FiltrosPlacas } from '../services/placasService';

export async function gerarBaixarRelatorioPlacas(placas: Placa[], filtros: FiltrosPlacas) {
  // 1. Gera o documento (é assíncrono, pode demorar alguns ms dependendo da quantidade)
  const doc = <RelatorioPlacasPdf placas={placas} filtros={filtros} />;
  const blob = await pdf(doc).toBlob();

  // 2. Cria a URL temporária para o blob
  const url = URL.createObjectURL(blob);

  // 3. Cria um link invisível para forçar o download
  const link = document.createElement('a');
  link.href = url;
  
  // Nome do arquivo: relatorio-placas-2023-11-03.pdf
  const data = new Date().toISOString().split('T')[0];
  link.download = `relatorio-placas-${data}.pdf`;
  
  // 4. Dispara o clique e limpa da memória
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}