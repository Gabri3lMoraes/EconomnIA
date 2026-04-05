import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const InsightsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Análise inteligente dos seus gastos</Text>
        </View>

        {/* 1. Gastos por Categoria */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>GASTOS POR CATEGORIA</Text>
          
          <CategoryBar label="Alimentação" value="R$ 420" progress={0.8} />
          <CategoryBar label="Transporte" value="R$ 245" progress={0.5} />
          <CategoryBar label="Lazer" value="R$ 155" progress={0.3} />
          <CategoryBar label="Moradia" value="R$ 1200" progress={0.7} />
          <CategoryBar label="Saúde" value="R$ 89" progress={0.2} />
        </View>

        {/* 2. Comparação Mensal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>COMPARAÇÃO MENSAL</Text>
          <View style={styles.comparisonRow}>
            
            <View style={styles.comparisonCol}>
              <Text style={styles.monthLabel}>Março</Text>
              <Text style={styles.monthValue}>R$ 3.850</Text>
              <Text style={[styles.stat, { color: '#FB7185' }]}>+8% vs Fev</Text>
            </View>

            <View style={styles.dividerVertical} />

            <View style={styles.comparisonCol}>
              <Text style={styles.monthLabel}>Abril (parcial)</Text>
              <Text style={[styles.monthValue, { color: '#34D399' }]}>R$ 3.480</Text>
              <Text style={[styles.stat, { color: '#34D399' }]}>-9.6% vs Mar</Text>
            </View>

          </View>
        </View>

        {/* 3. Dicas da IA */}
        <View style={styles.aiSectionHeader}>
          <Ionicons name="sparkles" size={18} color="#34D399" />
          <Text style={styles.aiSectionTitle}>DICAS DA IA PARA ECONOMIZAR</Text>
        </View>

        <TipCard 
          icon="tv-outline" 
          text="Cancele a assinatura de streaming duplicada e economize R$30/mês" 
        />
        <TipCard 
          icon="bus-outline" 
          text="Use transporte público 2x/semana e economize R$120/mês" 
        />
        <TipCard 
          icon="fast-food-outline" 
          text="Cozinhe em casa nos fins de semana e economize R$180/mês" 
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-componentes ---

const CategoryBar = ({ label, value, progress }: any) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryLabel}>{label}</Text>
      <Text style={styles.categoryValue}>{value}</Text>
    </View>
    <View style={styles.progressBarTrack}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
    </View>
  </View>
);

const TipCard = ({ icon, text }: any) => (
  <View style={styles.tipCard}>
    <Ionicons name={icon} size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

// --- Estilos ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0B0B',},
  container: { padding: 20, paddingBottom: 40 },
  
  header: { marginBottom: 25 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#666', fontSize: 14, marginTop: 4 },

  sectionCard: {
    backgroundColor: '#131A23',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 18,
  },

  // Estilos da Barra de Categoria
  categoryContainer: { marginBottom: 16 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryLabel: { color: '#E5E7EB', fontSize: 14, fontWeight: '500' },
  categoryValue: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  progressBarTrack: { height: 8, backgroundColor: '#1F2937', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 4 },

  // Estilos de Comparação
  comparisonRow: { flexDirection: 'row', alignItems: 'center' },
  comparisonCol: { flex: 1, alignItems: 'flex-start' },
  dividerVertical: { width: 1, height: 40, backgroundColor: '#374151', marginHorizontal: 15 },
  monthLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
  monthValue: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  stat: { fontSize: 11, fontWeight: '600', marginTop: 4 },

  // Estilos das Dicas de IA
  aiSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  aiSectionTitle: { color: '#34D399', fontSize: 13, fontWeight: '700', marginLeft: 8, letterSpacing: 0.5 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1B15',
    borderWidth: 1,
    borderColor: '#103D2E',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  tipText: { color: '#D1D5DB', fontSize: 14, flex: 1, lineHeight: 20 },
});

export default InsightsScreen;