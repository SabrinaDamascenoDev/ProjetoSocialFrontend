import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Placa } from '../../types/placa';
import type { FiltrosPlacas } from '../../services/placasService';

const cores = {
  navy: '#011025',
  orange: '#C77700',
  light: '#F3F3F3',
  grey: '#7A7A7A',
  bom: { fundo: '#C8F0D0', texto: '#1B7A2F' },
  regular: { fundo: '#FFF1B8', texto: '#9A7B00' },
  ruim: { fundo: '#FFD0D0', texto: '#C62828' },
  vazio: { fundo: '#EEEEEE', texto: '#555555' },
};

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica', fontSize: 8 },
  
  // Cabeçalho da página (Logo e Título)
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: cores.navy, paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: cores.navy },
  subtitle: { fontSize: 9, color: cores.grey, marginTop: 4 },
  
  // Filtros
  resumoFiltros: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, padding: 8, backgroundColor: cores.light, borderRadius: 4 },
  filtroText: { fontSize: 8, marginRight: 15, color: cores.navy },
  filtroLabel: { fontWeight: 'bold' },
  
  // Tabela
  table: { width: '100%', flexDirection: 'column' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D1D5DB', minHeight: 28, alignItems: 'center' },
  tableHeader: { backgroundColor: cores.navy, color: '#FFFFFF', fontWeight: 'bold', fontSize: 8, minHeight: 30 },
  tableCell: { paddingHorizontal: 4, paddingVertical: 6, textAlign: 'center', fontSize: 8 },
  
  // Larguras explícitas das colunas (porcentagem da página)
  colFoto: { width: '8%', alignItems: 'center', justifyContent: 'center' },
  colCodigo: { width: '10%', textAlign: 'left', fontWeight: 'bold' },
  colLocal: { width: '30%', textAlign: 'left' },
  colEstado: { width: '10%' },
  colData: { width: '12%' },
  
  // Badges de status
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontSize: 7, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center' },
  
  // Footer
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: cores.grey, borderTopWidth: 1, borderTopColor: '#D1D5DB', paddingTop: 5 }
});

function StatusBadge({ status }: { status: string | null }) {
  const config = status === 'BOM' ? cores.bom : status === 'REGULAR' ? cores.regular : status === 'RUIM' ? cores.ruim : cores.vazio;
  const texto = status === 'BOM' ? 'Bom' : status === 'REGULAR' ? 'Regular' : status === 'RUIM' ? 'Ruim' : '—';
  
  return (
    <Text style={[styles.badge, { backgroundColor: config.fundo, color: config.texto }]}>
      {texto}
    </Text>
  );
}

interface Props {
  placas: Placa[];
  filtros: FiltrosPlacas;
}

export function RelatorioPlacasPdf({ placas, filtros }: Props) {
  const dataEmissao = new Date().toLocaleString('pt-BR');
  
  const filtrosAtivos = [];
  if (filtros.busca) filtrosAtivos.push(`Busca: "${filtros.busca}"`);
  if (filtros.estado !== 'todos') filtrosAtivos.push(`Estado: ${filtros.estado}`);
  if (filtros.codigo_contran !== 'todos') filtrosAtivos.push(`Tipo: ${filtros.codigo_contran}`);
  if (filtros.dataInicio) filtrosAtivos.push(`De: ${filtros.dataInicio}`);
  if (filtros.dataFim) filtrosAtivos.push(`Até: ${filtros.dataFim}`);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* Cabeçalho da Página */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Relatório de Placas</Text>
            <Text style={styles.subtitle}>Sistema de Sinalização de Trânsito - Quixadá</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.subtitle}>Data de emissão:</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: cores.navy }}>{dataEmissao}</Text>
            <Text style={styles.subtitle}>Total de registros: {placas.length}</Text>
          </View>
        </View>

        {/* Filtros aplicados */}
        {filtrosAtivos.length > 0 && (
          <View style={styles.resumoFiltros}>
            <Text style={styles.filtroText}><Text style={styles.filtroLabel}>Filtros aplicados: </Text>{filtrosAtivos.join('  |  ')}</Text>
          </View>
        )}

        {/* Tabela */}
        <View style={styles.table}>
          
          {/* O "fixed" faz o cabeçalho se repetir em todas as páginas */}
          <View style={[styles.tableRow, styles.tableHeader]} fixed>
            <Text style={[styles.tableCell, styles.colFoto]}>Foto</Text>
            <Text style={[styles.tableCell, styles.colCodigo]}>Código</Text>
            <Text style={[styles.tableCell, styles.colLocal]}>Localização</Text>
            <Text style={[styles.tableCell, styles.colEstado]}>Conservação</Text>
            <Text style={[styles.tableCell, styles.colEstado]}>Película</Text>
            <Text style={[styles.tableCell, styles.colEstado]}>Substrato</Text>
            <Text style={[styles.tableCell, styles.colEstado]}>Suporte</Text>
            <Text style={[styles.tableCell, styles.colData]}>Data</Text>
          </View>

          {/* Linhas de dados */}
          {placas.map((placa) => (
            /* O "wrap={false}" impede que a linha seja cortada ao meio entre páginas */
            <View key={placa.id} style={styles.tableRow} wrap={false}>
              
              <View style={[styles.tableCell, styles.colFoto]}>
                {placa.foto_url ? (
                  <Image src={placa.foto_url} style={{ width: 32, height: 24, borderRadius: 2, objectFit: 'cover' }} />
                ) : (
                  <Text style={{ fontSize: 7, color: cores.grey }}>Sem foto</Text>
                )}
              </View>
              
              <Text style={[styles.tableCell, styles.colCodigo]}>{placa.codigo}</Text>
              
              <Text style={[styles.tableCell, styles.colLocal]}>{placa.endereco}</Text>
              
              <View style={[styles.tableCell, styles.colEstado]}><StatusBadge status={placa.estado_conservacao} /></View>
              <View style={[styles.tableCell, styles.colEstado]}><StatusBadge status={placa.pelicula} /></View>
              <View style={[styles.tableCell, styles.colEstado]}><StatusBadge status={placa.substrato} /></View>
              <View style={[styles.tableCell, styles.colEstado]}><StatusBadge status={placa.suporte} /></View>
              
              <Text style={[styles.tableCell, styles.colData]}>{placa.data_registro.slice(0, 10).split('-').reverse().join('/')}</Text>
            </View>
          ))}
        </View>

        {/* Rodapé com Paginação */}
        <View style={styles.footer} fixed>
          <Text>Caça Placas - Relatório Gerado pelo Sistema</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}