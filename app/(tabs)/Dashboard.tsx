import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
// Ajuste o caminho do componente Cartao se necessário
import Cartao from "../../components/CartaoDeOrcamento"; 
import { useFinance } from "../../app/context/FinanceContext";

export default function Dashboard() {
  // Puxando os dados REAIS do contexto
  const { income, expenses, balance, transactions } = useFinance();

  // Configurações de Orçamento
  const budget = 4500; 
  const budgetPercent = budget > 0 ? Math.min(100, Math.round((expenses / budget) * 100)) : 0;

  // Lógica para pegar o último gasto real (se houver)
  const lastExpense = transactions.find(t => t.type === 'expense');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}> Olá,</Text>
      <Text style={styles.title}> Lucas 👋</Text>

      {/* CARD PRINCIPAL - SALDO */}
      <View style={styles.card}>
        <Text style={styles.smallText}>Saldo de Abril</Text>
        <Text style={styles.balance}>R$ {balance.toLocaleString("pt-BR")}</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Receitas</Text>
            <Text style={styles.incomeText}>R$ {income.toLocaleString("pt-BR")}</Text>
          </View>

          <View>
            <Text style={styles.label}>Despesas</Text>
            <Text style={styles.expenseText}>R$ {expenses.toLocaleString("pt-BR")}</Text>
          </View>
        </View>
      </View>

      {/* COMPONENTE DE ORÇAMENTO (O gráfico que você já tinha) */}
      <Cartao />

      {/* SEÇÃO: VOCÊ GASTOU MAIS EM */}
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, styles.iconSuccess]}>
          <Ionicons name="trending-up-outline" size={27} color="#34D399" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.smallText}>Último gasto registrado</Text>
          <Text style={styles.text}>
            {lastExpense ? (
              <>
                {lastExpense.title} <Text style={styles.expenseText}>({lastExpense.amount})</Text>
              </>
            ) : (
              "Nenhum gasto ainda"
            )}
          </Text>
        </View>
      </View>

      {/* SEÇÃO: DICA DA IA */}
      <View style={styles.aiBox}>
        <View style={[styles.iconBox, styles.iconAccent]}>
          <Ionicons name="sparkles-outline" size={25} color="#34D399" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.aiTitle}>💡 Dica da IA</Text>
          <Text style={styles.aiText}>
            {expenses > 3000 
              ? "Seu gasto está alto este mês. Tente reduzir compras não essenciais."
              : "Você está indo bem! Economizar R$ 80 em streaming dobraria sua meta mensal."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#0B1118",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "left",
  },
  card: {
    backgroundColor: "#131A23",
    padding: 22,
    borderRadius: 24,
    marginTop: 18,
  },
  smallText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  balance: {
    fontSize: 34,
    fontWeight: "800",
    color: "#34D399",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  incomeText: {
    color: "#34D399",
    fontSize: 16,
    fontWeight: "700",
  },
  expenseText: {
    color: "#FB7185",
    fontSize: 16,
    fontWeight: "700",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131A23",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
  },
  aiBox: {
    flexDirection: "row",
    backgroundColor: "#13202B",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconSuccess: {
    backgroundColor: "#13202B",
  },
  iconAccent: {
    backgroundColor: "#131A23",
  },
  cardContent: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34D399",
  },
  aiText: {
    fontSize: 14,
    color: "#E5E7EB",
    marginTop: 6,
    lineHeight: 20,
  },
});