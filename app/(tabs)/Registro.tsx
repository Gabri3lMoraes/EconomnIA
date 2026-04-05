import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FinBot Chat</Text>
        <Text style={styles.headerSubtitle}>Registre gastos conversando</Text>
        <View style={styles.divider} />
      </View>

      <ScrollView contentContainerStyle={styles.chatContainer}>
        {/* 2. Mensagem do Bot */}
        <View style={styles.botBubble}>
          <Text style={styles.botText}>
            Olá! 👋 Sou o FinBot. Me diga seus gastos ou receitas por texto ou áudio que eu registro tudo pra você!
          </Text>
        </View>

        {/* 3. Mensagem do Usuário */}
        <View style={styles.userBubble}>
          <Text style={styles.userText}>comprei 5 chocolates na americanas no pix</Text>
        </View>

        {/* 4. Card de Gasto Registrado */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
             <View style={styles.iconCircle}>
                <Ionicons name="receipt-outline" size={16} color="#FFF" />
             </View>
             <View style={{flex: 1, marginLeft: 8}}>
                <Text style={styles.cardStatus}>✅ Gasto Registrado!</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>comprei 5 chocolates na americ - R$ 5,00</Text>
             </View>
             <Ionicons name="chevron-up" size={18} color="#666" />
          </View>

          <View style={styles.cardDetails}>
            <DetailItem label="Produto" value="comprei 5 chocolates na americ" icon="cart-outline" />
            <DetailItem label="Quantidade" value="1" icon="layers-outline" />
            <DetailItem label="Valor" value="R$ 5,00" icon="cash-outline" isValue />
            <DetailItem label="Pagamento" value="Não informada" icon="card-outline" />
            <DetailItem label="Categoria" value="Lazer" icon="pricetag-outline" isCategory />
          </View>

          <Text style={styles.cardFooter}>Processado com IA • FinBot</Text>
        </View>
      </ScrollView>

      {/* 5. Input Area */}
      <View style={styles.inputWrapper}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mic" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <TextInput 
          style={styles.input}
          placeholder="Ex: gastei 15 no energético..."
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#10b981' }]}>
          <Ionicons name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Componente auxiliar para os itens do card
const DetailItem = ({ label, value, icon, isValue, isCategory }: any) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={14} color="#666" style={{width: 20}} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={[
        styles.detailValue, 
        isValue && { color: '#FFF', fontWeight: 'bold' },
        isCategory && { color: '#34D399' }
    ]}> {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0B0B' },
  header: { padding: 20, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#666', fontSize: 14, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#1A1A1A', marginTop: 15 },
  
  chatContainer: { padding: 15 },
  
  botBubble: {
    backgroundColor: '#1A1A1B',
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    maxWidth: '85%',
    marginBottom: 20,
  },
  botText: { color: '#FFF', lineHeight: 20 },

  userBubble: {
    backgroundColor: '#00E676', // Verde vibrante
    padding: 15,
    borderRadius: 20,
    borderTopRightRadius: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 20,
  },
  userText: { color: '#000', fontWeight: '500' },

  // Estilo do Card
  cardContainer: {
    backgroundColor: '#121214',
    borderRadius: 25,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginBottom: 100,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { backgroundColor: '#064E3B', padding: 6, borderRadius: 10 },
  cardStatus: { color: '#34D399', fontWeight: 'bold', fontSize: 14 },
  cardSubtitle: { color: '#666', fontSize: 12 },
  
  cardDetails: { paddingLeft: 5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { color: '#9CA3AF', fontSize: 13 },
  detailValue: { color: '#FFF', fontSize: 13, flex: 1 },

  cardFooter: { color: '#4B5563', fontSize: 10, fontStyle: 'italic', marginTop: 10 },

  // Input Area
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#0B0B0B',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1B',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    color: '#FFF',
    marginHorizontal: 10,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1A1A1B',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ChatScreen;