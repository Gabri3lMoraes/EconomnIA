// app/(tabs)/ChatScreen.tsx (RESTALRADO E COMPLETO)
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPORTANTE: Importando o nosso contexto financeiro global
import { useFinance } from '../context/FinanceContext'; 

// --- DEFINIÇÃO DOS TIPOS (TYPESCRIPT) ---

// Tipo para os dados do card do n8n
interface CardData {
  produto: string;
  quantidade: string;
  valor: string;
  pagamento: string;
  categoria: string;
}

// Tipo para o objeto de Mensagem
interface Message {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'card';
  text: string;
  summary?: string; 
  cardData?: CardData | null; 
}

// Tipo para as propriedades do DetailItem
interface DetailItemProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name']; 
  isValue?: boolean; 
  isCategory?: boolean; 
}

const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Puxando a função de adicionar transação do nosso cofre global!
  const { addTransaction } = useFinance(); 

  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      type: 'text', 
      text: 'Olá! 👋 Sou o FinBot. Me diga seus gastos ou receitas por texto ou áudio que eu registro tudo pra você!' 
    }
  ]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text: inputText.trim()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // URL real do seu webhook do n8n (certifique-se de que é a URL do túnel ativa)
      const webhookUrl = 'https://con-stood-farm-jurisdiction.trycloudflare.com/webhook-test/eff66059-9f19-47c3-bdbd-e7ccb8cb29de';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: newUserMessage.text,
          userId: 'usuario_123' // ID estático para teste
        }),
      });

      const data = await response.json();

      // --- 👇 MODIFICAÇÃO FUNCIONAL MANTIDA 👇 ---
      // Se for um card, passamos o objeto INTEIRO 'data' para o contexto.
      // Isso permite que o histórico real mostre o produto, categoria e data corretos.
      if (data.isCard) {
        addTransaction(data); 
      }
      // --- 👆 FIM DA MODIFICAÇÃO FUNCIONAL 👆 ---

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        type: data.isCard ? 'card' : 'text',
        text: data.title || data.reply || '✅ Cadastrado com sucesso',
        summary: data.description || 'Gasto registrado',
        cardData: data.cardData || null
      };

      setMessages(prev => [...prev, newBotMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        type: 'text',
        text: '❌ Ops! Tive um problema ao conectar com o servidor.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FinBot Chat</Text>
        <Text style={styles.headerSubtitle}>Registre gastos conversando</Text>
        <View style={styles.divider} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.chatContainer}
      >
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <View key={msg.id} style={styles.userBubble}>
                <Text style={styles.userText}>{msg.text}</Text>
              </View>
            );
          }

          if (msg.sender === 'bot' && msg.type === 'text') {
            return (
              <View key={msg.id} style={styles.botBubble}>
                <Text style={styles.botText}>{msg.text}</Text>
              </View>
            );
          }

          if (msg.sender === 'bot' && msg.type === 'card' && msg.cardData) {
            const isExpanded = expandedCardId === msg.id;

            // --- 👇 SEU LAYOUT BONITO RESTAURADO 👇 ---
            return (
              <View key={msg.id} style={styles.cardContainer}>
                
                <TouchableOpacity 
                  style={styles.cardHeader}
                  onPress={() => setExpandedCardId(isExpanded ? null : msg.id)}
                  activeOpacity={0.7}
                >
                    <View style={styles.iconCircle}>
                       <Ionicons name="receipt-outline" size={16} color="#FFF" />
                    </View>
                    <View style={{flex: 1, marginLeft: 8}}>
                      <Text style={styles.cardStatus}>{msg.text}</Text>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>{msg.summary}</Text>
                    </View>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#666" 
                    />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.cardDetails}>
                    <DetailItem label="Produto" value={msg.cardData.produto} icon="cart-outline" />
                    <DetailItem label="Quantidade" value={msg.cardData.quantidade} icon="layers-outline" />
                    <DetailItem label="Valor" value={msg.cardData.valor} icon="cash-outline" isValue />
                    <DetailItem label="Pagamento" value={msg.cardData.pagamento} icon="card-outline" />
                    <DetailItem label="Categoria" value={msg.cardData.categoria} icon="pricetag-outline" isCategory />
                  </View>
                )}

                <Text style={styles.cardFooter}>Processado com IA • FinBot</Text>
              </View>
            );
          }
          return null;
        })}
        
        {isLoading && (
          <View style={[styles.botBubble, { width: 60, alignItems: 'center' }]}>
            <ActivityIndicator color="#00E676" size="small" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputWrapper}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mic" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <TextInput 
          style={styles.input}
          placeholder="Ex: gastei 15 no energético..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: inputText.trim() ? '#10b981' : '#333' }]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? '#000' : '#666'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Componente auxiliar mantido intacto
const DetailItem = ({ label, value, icon, isValue, isCategory }: DetailItemProps) => (
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
  safeArea: { flex: 1, backgroundColor: '#0B1118' },
  header: { padding: 20, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#666', fontSize: 14, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#1A1A1A', marginTop: 15 },
  
  chatContainer: { padding: 15, paddingBottom: 40 },
  
  botBubble: {
    backgroundColor: '#1e2220',
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    maxWidth: '85%',
    marginBottom: 20,
  },
  botText: { color: '#FFF', lineHeight: 20 },

  userBubble: {
    backgroundColor: '#34D399',
    padding: 15,
    borderRadius: 20,
    borderTopRightRadius: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 20,
  },
  userText: { color: '#000000', fontWeight: '500' },

  cardContainer: {
    backgroundColor: '#121214',
    borderRadius: 25,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginBottom: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { backgroundColor: '#064E3B', padding: 6, borderRadius: 10 },
  cardStatus: { color: '#34D399', fontWeight: 'bold', fontSize: 14 },
  cardSubtitle: { color: '#666', fontSize: 12 },
  
  cardDetails: { paddingLeft: 5, marginTop: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { color: '#9CA3AF', fontSize: 13 },
  detailValue: { color: '#FFF', fontSize: 13, flex: 1 },

  cardFooter: { color: '#4B5563', fontSize: 10, fontStyle: 'italic', marginTop: 10 },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#0B1118',
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