import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importação adicionada

type AuthMode = "login" | "register";

// onLogin removido daqui para usar o router do Expo
const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter(); // Inicializa o roteador do Expo Router

  // Animação de entrada do Header
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) return;
    
    setLoading(true);
    // Simula o tempo de requisição da API
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    
    // Navega para o Dashboard após o login/registro
    router.replace('/(tabs)/Dashboard');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    
    // Navega para o Dashboard após o login com Google
    router.replace('/(tabs)/Dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Brand */}
          <Animated.View style={[
              styles.logoContainer, 
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>F</Text>
            </View>
            <Text style={styles.title}>FinBot</Text>
            <Text style={styles.subtitle}>Seu assistente financeiro com IA</Text>
          </Animated.View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Entrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, mode === 'register' && styles.tabButtonActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Criar conta</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {mode === "register" && (
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Feather name="mail" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {mode === "login" && (
              <TouchableOpacity>
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.submitButton, loading && { opacity: 0.7 }]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text style={styles.submitText}>
                    {mode === "login" ? "Entrar" : "Criar conta"}
                  </Text>
                  <Feather name="arrow-right" size={18} color="#000" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogle}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={18} color="#FFF" />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            Ao continuar, você concorda com os{"\n"}
            <Text style={styles.footerLink}>Termos de Uso</Text> e{" "}
            <Text style={styles.footerLink}>Política de Privacidade</Text>
          </Text>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#0B0B0B' 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  
  // Header / Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)', // Fundo com transparência
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981', // Cor Primária
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },

  // Tab Switcher
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#10b981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#000',
  },

  // Formulário
  formContainer: {
    gap: 16, // Compatível com React Native moderno
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1B',
    borderWidth: 1,
    borderColor: '#2A2A2B',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  forgotText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginBottom: 16,
    marginTop: -8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 50,
  },
  submitText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },

  // Divisor
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2B',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginHorizontal: 12,
  },

  // Botão Google
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1B',
    borderWidth: 1,
    borderColor: '#2A2A2B',
    borderRadius: 12,
    height: 50,
  },
  googleText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },

  // Footer
  footerText: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 30,
    lineHeight: 18,
  },
  footerLink: {
    color: '#10b981',
  },
});

export default AuthScreen;