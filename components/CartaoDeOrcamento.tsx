import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
// 1. Importamos o contexto global
import { useFinance } from '../app/context/FinanceContext'; 

// Funções auxiliares (Mantidas exatamente como as suas)
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
}

const CartaoDeOrcamento = () => {
  // 2. Puxamos os gastos reais do contexto
  const { expenses } = useFinance();

  // 3. Calculamos a porcentagem real (Baseada no orçamento de 4500)
  const budget = 4500;
  const porcentagemReal = budget > 0 ? Math.min(100, Math.round((expenses / budget) * 100)) : 0;

  // Parâmetros Visuais (Seus valores originais)
  const raio = 105; 
  const espessuraDoTraço = 10; 
  const espessuraDoBrilho = 14; 
  const opacidadeDoBrilho = 0.35; 

  const larguraSvg = 230;
  const alturaSvg = 120; 
  const centroX = larguraSvg / 2;
  const centroY = alturaSvg - 5; 

  // Ângulos baseados na porcentagem real
  const anguloInicial = -90; 
  const anguloFinal = anguloInicial + (180 * porcentagemReal) / 100; 

  // Caminhos SVG
  const trilhaPath = describeArc(centroX, centroY, raio, -90, 90);
  const progressoPath = describeArc(centroX, centroY, raio, anguloInicial, anguloFinal);

  return (
    <View style={styles.container}>
      <Text style={styles.textoCabecalho}>Uso do Orçamento</Text>

      <View style={styles.containerMedidor}>
        <Svg width={larguraSvg} height={alturaSvg}>
          {/* Trilha do Medidor */}
          <Path
            d={trilhaPath}
            fill="none"
            stroke="#2C3440"
            strokeWidth={espessuraDoTraço}
            strokeLinecap="round"
          />
          {/* Camada de Brilho */}
          <Path
            d={progressoPath}
            fill="none"
            stroke="#17E08F" 
            strokeWidth={espessuraDoBrilho}
            strokeLinecap="round"
            strokeOpacity={opacidadeDoBrilho}
          />
          {/* Camada de Progresso (Opaca) */}
          <Path
            d={progressoPath}
            fill="none"
            stroke="#17E08F" 
            strokeWidth={espessuraDoTraço}
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.containerTexto}>
            {/* 4. Mostramos a porcentagem real calculada */}
            <Text style={styles.textoPorcentagem}>{porcentagemReal}%</Text>
            <Text style={styles.textoSubCabecalho}>do orçamento usado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131A23', // Ajustei para o fundo dos seus outros cards
    borderRadius: 24,
    padding: 20,
    marginTop: 18,
    width: '100%', // Agora ele se adapta à largura do Dashboard
    alignSelf: 'center',
  },
  textoCabecalho: {
    color: '#AAB3C0',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  containerMedidor: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140, // Ajuste para o texto não ficar muito longe do arco
    width: '100%',
  },
  containerTexto: {
    position: 'absolute',
    top: 60, // Centralizando o texto dentro do semicírculo
    alignItems: 'center',
  },
  textoPorcentagem: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  textoSubCabecalho: {
    color: '#8C98A7',
    fontSize: 10,
    marginTop: 2,
  },
});

export default CartaoDeOrcamento;