import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Placa } from '../../types/placa';
import type { FiltrosPlacas } from '../../services/placasService';
import logoCacaPlacas from '../../assets/logo.png';

const cores = {
  navy: '#011025',
  orange: '#C77700',
  lightGrey: '#F3F3F3',
  borderGrey: '#D1D5DB',
  textGrey: '#4A5568',
};

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica', fontSize: 9, color: cores.navy },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  logo: { width: 80, height: 'auto', objectFit: 'contain' },
  headerRight: { textAlign: 'right', fontSize: 9, fontWeight: 'bold' },
  headerText: { marginBottom: 4 },
  
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 15, marginBottom: 10, textTransform: 'uppercase' },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '23%', borderWidth: 1, borderColor: cores.borderGrey, borderRadius: 4, padding: 8, alignItems: 'center' },
  summaryCardTitle: { fontSize: 9, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  summaryCardValue: { fontSize: 16, fontWeight: 'bold' },
  summaryCardDesc: { fontSize: 7, color: cores.textGrey, textAlign: 'center', marginTop: 4 },

  table: { width: '100%', borderWidth: 1, borderColor: cores.borderGrey, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderBottomWidth: 1, borderBottomColor: cores.borderGrey, paddingVertical: 6 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: cores.borderGrey, paddingVertical: 6 },
  tableRowTotal: { flexDirection: 'row', backgroundColor: '#E5E7EB', paddingVertical: 6, fontWeight: 'bold' },
  colCodigo: { width: '20%', textAlign: 'center', fontSize: 9 },
  colNome: { width: '60%', textAlign: 'center', fontSize: 9 },
  colQtd: { width: '20%', textAlign: 'center', fontSize: 9, fontWeight: 'bold' },

  typologyContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  typologyCard: { width: '47%', borderWidth: 1, borderColor: cores.borderGrey, borderRadius: 4, padding: 10, marginBottom: 10 },
  typologyTitle: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  typologySubtitle: { fontSize: 8, color: cores.textGrey, marginBottom: 8 },
  typologyLine: { fontSize: 8, color: cores.textGrey, marginBottom: 2 },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: cores.textGrey, borderTopWidth: 1, borderTopColor: cores.borderGrey, paddingTop: 5 }
});

interface Props {
  placas: Placa[];
  filtros: FiltrosPlacas;
}

export function RelatorioPlacasPdf({ placas, filtros }: Props) {
  const total = placas.length;
  const totalBom = placas.filter(p => p.estado_conservacao === 'BOM').length;
  const totalRegular = placas.filter(p => p.estado_conservacao === 'REGULAR').length;
  const totalRuim = placas.filter(p => p.estado_conservacao === 'RUIM').length;

  const porCodigo = placas.reduce((acc, placa) => {
    const cod = placa.codigo;
    if (!acc[cod]) {
      acc[cod] = {
        codigo: cod,
        nome: placa.descricao_contran || cod,
        total: 0,
        bom: 0,
        regular: 0,
        ruim: 0
      };
    }
    acc[cod].total++;
    if (placa.estado_conservacao === 'BOM') acc[cod].bom++;
    if (placa.estado_conservacao === 'REGULAR') acc[cod].regular++;
    if (placa.estado_conservacao === 'RUIM') acc[cod].ruim++;
    return acc;
  }, {} as Record<string, { codigo: string, nome: string, total: number, bom: number, regular: number, ruim: number }>);

  const codigosArray = Object.values(porCodigo);

  const enderecoFiltro = filtros.busca ? `Busca: ${filtros.busca}` : 'Todos os registros';

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image src={logoCacaPlacas} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.headerText}>Relatório Técnico de Campo</Text>
            <Text style={styles.headerText}>Endereço:</Text>
            <Text style={styles.headerText}>Rua: {enderecoFiltro}</Text>
          </View>
        </View>

        {/* 1. Resumo Executivo */}
        <Text style={styles.sectionTitle}>1. Resumo Executivo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>TOTAL</Text>
            <Text style={styles.summaryCardValue}>{total}</Text>
            <Text style={styles.summaryCardDesc}>Número selecionado nos filtros</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>ESTADO BOM</Text>
            <Text style={styles.summaryCardValue}>{totalBom}</Text>
            <Text style={styles.summaryCardDesc}>Número de placas boas nos filtros</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>ESTADO REGULAR</Text>
            <Text style={styles.summaryCardValue}>{totalRegular}</Text>
            <Text style={styles.summaryCardDesc}>Número de placas regulares nos filtros</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>ESTADO RUIM</Text>
            <Text style={styles.summaryCardValue}>{totalRuim}</Text>
            <Text style={styles.summaryCardDesc}>Número de placas ruins nos filtros</Text>
          </View>
        </View>

        {/* 2. Quantitativo por Código */}
        <Text style={styles.sectionTitle}>2. Quantitativo por Código de Sinalização</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colCodigo, { fontWeight: 'bold' }]}>CÓDIGO</Text>
            <Text style={[styles.colNome, { fontWeight: 'bold' }]}>NOME DA SINALIZAÇÃO</Text>
            <Text style={[styles.colQtd, { fontWeight: 'bold' }]}>QUANTIDADE</Text>
          </View>

          {codigosArray.map((item) => (
            <View key={item.codigo} style={styles.tableRow} wrap={false}>
              <Text style={styles.colCodigo}>{item.codigo}</Text>
              <Text style={styles.colNome}>{item.nome}</Text>
              <Text style={styles.colQtd}>{item.total}</Text>
            </View>
          ))}

          <View style={styles.tableRowTotal}>
            <Text style={[styles.colCodigo, { width: '80%', textAlign: 'right', paddingRight: 10 }]}>TOTAL GERAL DE DISPOSITIVOS</Text>
            <Text style={styles.colQtd}>{total}</Text>
          </View>
        </View>

        {/* 3. Tipologia dos Sinais */}
        <Text style={styles.sectionTitle}>3. Tipologia dos Sinais Vistoriados</Text>
        <View style={styles.typologyContainer}>
          {codigosArray.map((item) => (
            <View key={item.codigo} style={styles.typologyCard} wrap={false}>
              <Text style={styles.typologyTitle}>SINAL {item.codigo} - {item.nome}</Text>
              <Text style={styles.typologySubtitle}>Total em campo: {item.total} unidades</Text>
              
              <Text style={styles.typologyLine}>{item.ruim} unidades em estado ruim.</Text>
              <Text style={styles.typologyLine}>{item.regular} unidades em estado regular.</Text>
              <Text style={styles.typologyLine}>{item.bom} unidades em estado bom.</Text>
            </View>
          ))}
        </View>

        {/* Rodapé */}
        <View style={styles.footer} fixed>
          <Text>Caça Placas - Relatório Técnico</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}