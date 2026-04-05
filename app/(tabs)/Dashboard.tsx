import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
// No topo do seu Dashboard.tsx, altere a linha 3 para:
import Cartao from "../../components/CartaoDeOrcamento";
const c = <Cartao />; // IGNORE - Apenas para garantir que o componente seja importado corretamente
export default function DashboardScreen() {
  const income = 5200;
  const expenses = 3480;
  const balance = income - expenses;
  const budget = 4500;
  const budgetPercent = Math.min(100, Math.round((expenses / budget) * 100));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}> Ola,</Text>
      <Text style={styles.title}> Lucas 👋</Text>

      <View style={styles.card}>
        <Text style={styles.smallText}>Saldo de Abril</Text>
        <Text style={styles.balance}>R$ {balance.toLocaleString("pt-BR")}</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Receitas</Text>
            <Text style={styles.income}>R$ {income.toLocaleString("pt-BR")}</Text>
          </View>

          <View>
            <Text style={styles.label}>Despesas</Text>
            <Text style={styles.expense}>R$ {expenses.toLocaleString("pt-BR")}</Text>
          </View>
        </View>
      </View>

      <Cartao />

      <View style={styles.cardRow}>
        <View style={[styles.iconBox, styles.iconSuccess]}>
          <Text style={styles.iconText}> <Ionicons name="trending-up-outline" size={27} color="#34D399" /></Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.smallText}>Você gastou mais em</Text>
          <Text style={styles.text}>
            Alimentação <Text style={styles.expense}>(R$ 420)</Text>
          </Text>
        </View>
      </View>

      <View style={styles.aiBox}>
        <View style={[styles.iconBox, styles.iconAccent]}>
          <Text style={styles.iconText}><Ionicons name="sparkles-outline" size={25} color="#34D399" /></Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.aiTitle}>💡 Dica da IA</Text>
          <Text style={styles.aiText}>
            Você pode economizar R$80 cortando serviços de streaming duplicados.
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
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

  income: {
    color: "#34D399",
    fontSize: 16,
    fontWeight: "700",
  },

  expense: {
    color: "#FB7185",
    fontSize: 16,
    fontWeight: "700",
  },

  gaugeWrapper: {
    marginTop: 14,
    alignItems: "center",
  },

  gaugeTrack: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    overflow: "hidden",
    backgroundColor: "#1F2A38",
    justifyContent: "flex-end",
  },

  gaugeFill: {
    height: "100%",
    backgroundColor: "#34D399",
  },

  gaugeCenter: {
    position: "absolute",
    top: 22,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  gaugePercent: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },

  gaugeLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131A23",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  aiBox: {
    flexDirection: "row",
    backgroundColor: "#13202B",
    padding: 18,
    borderRadius: 24,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    textAlign: "center",
  },

  iconSuccess: {
    backgroundColor: "#13202B",
  },

  iconAccent: {
    backgroundColor: "#131A23",
  },

  iconText: {
    fontSize: 18,
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