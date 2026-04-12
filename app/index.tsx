// Arquivo: app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Troque para true depois para testar indo direto pro Dashboard
  const isUserLoggedIn = true; 


  // Joga pra pasta (tabs), que vai abrir o seu TabLayout
  return <Redirect href="/(tabs)/Dashboard" />;
}