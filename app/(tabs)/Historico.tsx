import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
// Ajuste o caminho abaixo se a sua pasta context estiver em outro lugar
import { useFinance, Transaction } from "../../app/context/FinanceContext"; 

// --- Componentes Auxiliares Visuais ---

// 1. Card de Resumo (Receitas, Despesas, etc)
const SummaryCard = ({ title, amount, color }: { title: string, amount: string, color: string }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={[styles.summaryAmount, { color }]}>{amount}</Text>
  </View>
);

// 2. Gráfico Donut Dinâmico (Com a categoria "Outros")
const DonutChart = ({ expenses, pAli, pTra, pLaz, pAss, pOut }: any) => {
  const radius = 45;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  
  // Se não houver despesas, mostra apenas o fundo cinza
  if (expenses <= 0) {
    return (
      <View style={styles.donutContainer}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r={radius} stroke="#1F2937" strokeWidth={strokeWidth} fill="none" />
        </Svg>
      </View>
    );
  }

  // Cálculos de deslocamento para encaixar as fatias
  const offsetTra = -(circumference * pAli);
  const offsetLaz = offsetTra - (circumference * pTra);
  const offsetAss = offsetLaz - (circumference * pLaz);
  const offsetOut = offsetAss - (circumference * pAss);

  return (
    <View style={styles.donutContainer}>
      <Svg width="120" height="120" viewBox="0 0 120 120">
        <G rotation="-90" origin="60, 60">
          {pAli > 0 && <Circle cx="60" cy="60" r={radius} stroke="#0EA5E9" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference * pAli} ${circumference}`} strokeLinecap="round" />}
          {pTra > 0 && <Circle cx="60" cy="60" r={radius} stroke="#34D399" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference * pTra} ${circumference}`} strokeDashoffset={offsetTra} strokeLinecap="round" />}
          {pLaz > 0 && <Circle cx="60" cy="60" r={radius} stroke="#8B5CF6" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference * pLaz} ${circumference}`} strokeDashoffset={offsetLaz} strokeLinecap="round" />}
          {pAss > 0 && <Circle cx="60" cy="60" r={radius} stroke="#FBBF24" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference * pAss} ${circumference}`} strokeDashoffset={offsetAss} strokeLinecap="round" />}
          {pOut > 0 && <Circle cx="60" cy="60" r={radius} stroke="#9CA3AF" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${circumference * pOut} ${circumference}`} strokeDashoffset={offsetOut} strokeLinecap="round" />}
        </G>
      </Svg>
    </View>
  );
};

export default function Historico() {
  const { transactions, income, expenses } = useFinance();
  
  // Estados para os filtros
  const [mainFilter, setMainFilter] = useState('Tudo');
  const [subFilter, setSubFilter] = useState('Tudo');

  // Função para converter "R$ 15,00" ou "-R$ 15,00" em número (15.00)
  const parseAmount = (amountStr: string) => {
    const num = Number(amountStr.replace(/[^0-9,-]+/g,"").replace(",", "."));
    return isNaN(num) ? 0 : Math.abs(num);
  };

  // --- MATEMÁTICA DAS CATEGORIAS ---
  const despesas = transactions.filter(t => t.type === 'expense');

  const totalAssinaturas = despesas
    .filter(t => t.isRecurring)
    .reduce((acc, curr) => acc + parseAmount(curr.amount), 0);
  
  const totalAlimentacao = despesas
    .filter(t => !t.isRecurring && (t.icon === 'restaurant-outline' || t.icon === 'cart-outline' || t.category.toLowerCase().includes('aliment')))
    .reduce((acc, curr) => acc + parseAmount(curr.amount), 0);
  
  const totalTransporte = despesas
    .filter(t => !t.isRecurring && (t.icon === 'car-outline' || t.category.toLowerCase().includes('transport')))
    .reduce((acc, curr) => acc + parseAmount(curr.amount), 0);
  
  const totalLazer = despesas
    .filter(t => !t.isRecurring && (t.icon === 'tv-outline' || t.category.toLowerCase().includes('lazer')))
    .reduce((acc, curr) => acc + parseAmount(curr.amount), 0);

  // Tudo que sobrou cai em "Outros" para a conta fechar exata
  const somaMapeada = totalAssinaturas + totalAlimentacao + totalTransporte + totalLazer;
  const totalOutros = expenses > somaMapeada ? expenses - somaMapeada : 0;

  // Monta as legendas
  const donutLegendsData = [
    { color: '#0EA5E9', label: 'Alimentação', value: totalAlimentacao },
    { color: '#34D399', label: 'Transporte', value: totalTransporte },
    { color: '#8B5CF6', label: 'Lazer', value: totalLazer },
    { color: '#FBBF24', label: 'Assinaturas', value: totalAssinaturas },
  ];
  if (totalOutros > 0) {
    donutLegendsData.push({ color: '#9CA3AF', label: 'Outros', value: totalOutros });
  }

  // --- FILTRAGEM DA LISTA ---
  let filteredTransactions = transactions;
  
  if (mainFilter === 'Assinaturas') filteredTransactions = filteredTransactions.filter(t => t.isRecurring);
  if (mainFilter === 'Parcelas') filteredTransactions = filteredTransactions.filter(t => t.installments && t.installments > 1);
  
  if (subFilter === 'Receitas') filteredTransactions = filteredTransactions.filter(t => t.type === 'income');
  if (subFilter === 'Despesas') filteredTransactions = filteredTransactions.filter(t => t.type === 'expense');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Visão Geral</Text>
      </View>

      {/* GRID DE RESUMOS */}
      <View style={styles.grid}>
        <SummaryCard title="RECEITAS" amount={`R$ ${income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} color="#34D399" />
        <SummaryCard title="DESPESAS" amount={`R$ ${expenses.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} color="#FB7185" />
        <SummaryCard title="ASSINATURAS/MÊS" amount={`R$ ${totalAssinaturas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} color="#E5E7EB" />
        <SummaryCard title="A RECEBER" amount="R$ 0,00" color="#34D399" />
      </View>

      {/* GRÁFICO DE FLUXO SEMANAL */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>FLUXO SEMANAL</Text>
        <View style={styles.barChartContainer}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
            <View key={day} style={styles.barCol}>
              <View style={styles.barsWrapper}></View> 
              <Text style={styles.barLabel}>{day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#34D399' }]} /><Text style={styles.legendText}>Receitas</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FB7185' }]} /><Text style={styles.legendText}>Despesas</Text></View>
        </View>
      </View>

      {/* GRÁFICO DE DESPESAS POR CATEGORIA */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>DESPESAS POR CATEGORIA</Text>
        <View style={styles.donutRow}>
          <DonutChart 
            expenses={expenses}
            pAli={expenses > 0 ? totalAlimentacao / expenses : 0}
            pTra={expenses > 0 ? totalTransporte / expenses : 0}
            pLaz={expenses > 0 ? totalLazer / expenses : 0}
            pAss={expenses > 0 ? totalAssinaturas / expenses : 0}
            pOut={expenses > 0 ? totalOutros / expenses : 0}
          />
          <View style={styles.donutLegends}>
            {donutLegendsData.map(leg => (
              <View key={leg.label} style={styles.donutLegendItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.legendDot, { backgroundColor: leg.color }]} />
                  <Text style={styles.legendText}>{leg.label}</Text>
                </View>
                <Text style={styles.legendValue}>
                  R$ {leg.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* FILTROS PRINCIPAIS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mainFiltersScroll}>
        {['Tudo', 'Assinaturas', 'Parcelas', 'A Receber'].map(filter => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.mainFilterBtn, mainFilter === filter && styles.mainFilterBtnActive]}
            onPress={() => setMainFilter(filter)}
          >
            {filter === 'Tudo' && <Ionicons name="grid-outline" size={14} color={mainFilter === filter ? '#000' : '#9CA3AF'} style={{marginRight: 6}} />}
            {filter === 'Assinaturas' && <Ionicons name="repeat-outline" size={14} color={mainFilter === filter ? '#000' : '#9CA3AF'} style={{marginRight: 6}} />}
            {filter === 'Parcelas' && <Ionicons name="card-outline" size={14} color={mainFilter === filter ? '#000' : '#9CA3AF'} style={{marginRight: 6}} />}
            {filter === 'A Receber' && <Ionicons name="time-outline" size={14} color={mainFilter === filter ? '#000' : '#9CA3AF'} style={{marginRight: 6}} />}
            <Text style={[styles.mainFilterText, mainFilter === filter && styles.mainFilterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SUB-FILTROS */}
      <View style={styles.subFiltersRow}>
        {['Tudo', 'Receitas', 'Despesas'].map(sub => (
          <TouchableOpacity 
            key={sub} 
            style={[styles.subFilterBtn, subFilter === sub && styles.subFilterBtnActive]}
            onPress={() => setSubFilter(sub)}
          >
            <Text style={[styles.subFilterText, subFilter === sub && styles.subFilterTextActive]}>{sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA DE TRANSAÇÕES */}
      <View style={styles.list}>
        {filteredTransactions.length === 0 ? (
          <Text style={styles.empty}>Nenhuma transação encontrada.</Text>
        ) : (
          filteredTransactions.map(item => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={20} color={item.type === 'income' ? '#34D399' : '#FB7185'} />
              </View>
              
              <View style={styles.transactionDetails}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
                <Text style={styles.itemSub}>{item.category} · {item.date}</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: item.type === 'income' ? '#34D399' : '#FB7185' }]}>
                  {item.amount}
                </Text>
                {/* Badges de Assinatura ou Parcela */}
                {item.isRecurring && (
                  <Text style={styles.badgeText}>🔄 MENSAL</Text>
                )}
                {item.installments && item.installments > 1 && (
                  <Text style={styles.badgeText}>💳 1/{item.installments}x</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, backgroundColor: '#0B1118', flexGrow: 1, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  
  // Grid de Resumos
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { backgroundColor: '#131A23', width: '48%', padding: 18, borderRadius: 20, marginBottom: 15 },
  summaryTitle: { color: '#9CA3AF', fontSize: 10, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  summaryAmount: { fontSize: 18, fontWeight: '800', color: '#FFF' },

  // Estilos Comuns de Gráficos
  chartCard: { backgroundColor: '#131A23', padding: 20, borderRadius: 24, marginBottom: 20 },
  chartTitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', marginBottom: 20 },
  
  // Gráfico de Barras
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end', paddingHorizontal: 10 },
  barCol: { alignItems: 'center', width: 30 },
  barsWrapper: { height: 100, width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4 },
  barLabel: { color: '#6B7280', fontSize: 11, marginTop: 10 },
  
  // Legendas
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#9CA3AF', fontSize: 12 },

  // Gráfico Donut
  donutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  donutContainer: { alignItems: 'center', justifyContent: 'center' },
  donutLegends: { flex: 1, paddingLeft: 20, gap: 12 },
  donutLegendItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legendValue: { color: '#FFF', fontWeight: '600', fontSize: 13 },

  // Filtros Principais
  mainFiltersScroll: { marginBottom: 20, flexGrow: 0 },
  mainFilterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A23', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#1F2937' },
  mainFilterBtnActive: { backgroundColor: '#34D399', borderColor: '#34D399' },
  mainFilterText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  mainFilterTextActive: { color: '#0B1118', fontWeight: '700' },

  // Sub Filtros
  subFiltersRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  subFilterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  subFilterBtnActive: { backgroundColor: '#1F2937' },
  subFilterText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  subFilterTextActive: { color: '#FFF' },

  // Lista de Transações
  list: { marginTop: 5 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A23', padding: 18, borderRadius: 20, marginBottom: 12 },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#1C2531', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transactionDetails: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { color: '#FFF', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  itemSub: { color: '#6B7280', fontSize: 12 },
  amountContainer: { alignItems: 'flex-end' },
  amount: { fontWeight: '800', fontSize: 15, marginBottom: 4 },
  badgeText: { color: '#6B7280', fontSize: 9, fontWeight: '700', marginTop: 2 },
  empty: { color: '#666', textAlign: 'center', marginTop: 30 }
});