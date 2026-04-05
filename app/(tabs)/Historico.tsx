import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

type HistoryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  icon: IconName;
};

const historyItems: HistoryItem[] = [
  { id: '1', title: 'Salário', category: 'Trabalho', date: '01 Abr', amount: '+R$ 5.200', type: 'income', icon: 'cash-outline' },
  { id: '2', title: 'Supermercado', category: 'Alimentação', date: '02 Abr', amount: '-R$ 280', type: 'expense', icon: 'cart-outline' },
  { id: '3', title: 'Uber', category: 'Transporte', date: '03 Abr', amount: '-R$ 45', type: 'expense', icon: 'car-outline' },
  { id: '4', title: 'Freelance Design', category: 'Freelance', date: '04 Abr', amount: '+R$ 800', type: 'income', icon: 'briefcase-outline' },
  { id: '5', title: 'Restaurante', category: 'Alimentação', date: '05 Abr', amount: '-R$ 140', type: 'expense', icon: 'restaurant-outline' },
  { id: '6', title: 'Café', category: 'Alimentação', date: '05 Abr', amount: '-R$ 22', type: 'expense', icon: 'cafe-outline' },
  { id: '7', title: 'Netflix + Spotify', category: 'Lazer', date: '06 Abr', amount: '-R$ 55', type: 'expense', icon: 'tv-outline' },
  { id: '8', title: 'Gasolina', category: 'Transporte', date: '07 Abr', amount: '-R$ 200', type: 'expense', icon: 'speedometer-outline' },
];

const filterTabs = ['Tudo', 'Receitas', 'Despesas'];
const filterIcons: Record<string, IconName> = {
  Tudo: 'layers-outline',
  Receitas: 'arrow-up-circle-outline',
  Despesas: 'arrow-down-circle-outline',
};

export default function Historico() {
  const [selectedTab, setSelectedTab] = useState('Tudo');

  const filteredItems = historyItems.filter((item) => {
    if (selectedTab === 'Tudo') return true;
    if (selectedTab === 'Receitas') return item.type === 'income';
    return item.type === 'expense';
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>Abril 2026</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>RECEITAS</Text>
            <Ionicons name="arrow-up-circle" size={18} color="#34D399" />
          </View>
          <Text style={styles.statValue}>R$ 6.000</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>DESPESAS</Text>
            <Ionicons name="arrow-down-circle" size={18} color="#FB7185" />
          </View>
          <Text style={styles.statValueExpense}>R$ 742</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filterTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={({ pressed }) => [
              styles.filterButton,
              selectedTab === tab && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
          >
            <Ionicons
              name={filterIcons[tab]}
              size={14}
              color={selectedTab === tab ? '#0B1118' : '#9CA3AF'}
              style={styles.filterIcon}
            />
            <Text style={[styles.filterText, selectedTab === tab && styles.filterTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View style={[styles.itemIcon, item.type === 'income' ? styles.iconIncome : styles.iconExpense]}>
              <Ionicons name={item.icon} size={18} color="#fff" />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.category} · {item.date}</Text>
            </View>
            <Text style={[styles.itemAmount, item.type === 'income' ? styles.amountIncome : styles.amountExpense]}>
              {item.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#0B1118',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#131A23',
    padding: 18,
    borderRadius: 20,
    marginRight: 12,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#34D399',
    fontSize: 20,
    fontWeight: '700',
  },
  statValueExpense: {
    color: '#FB7185',
    fontSize: 20,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 22,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#131A23',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#0DE27D',
  },
  filterButtonPressed: {
    opacity: 0.8,
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#0B1118',
  },
  filterIcon: {
    marginRight: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  list: {
    marginTop: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131A23',
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
  },
  itemIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconIncome: {
    backgroundColor: '#183C2D',
  },
  iconExpense: {
    backgroundColor: '#2F1723',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountIncome: {
    color: '#34D399',
  },
  amountExpense: {
    color: '#FB7185',
  },
});
