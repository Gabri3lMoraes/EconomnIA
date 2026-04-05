import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Função para converter coordenadas polares em cartesianas (necessário para SVG)
// Adicionamos ': number' para cada parâmetro e para o retorno da função
function polarToCartesian(
  centerX: number, 
  centerY: number, 
  radius: number, 
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

// Adicionamos ': number' nos parâmetros e ': string' no retorno (pois gera um path SVG)
function describeArc(
  x: number, 
  y: number, 
  radius: number, 
  startAngle: number, 
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
  
  return d;
}

const CartaoDeOrcamento = () => {
  // Parâmetros do Medidor
  const porcentagem = 77;
  const raio = 105; // Raio do medidor
  const espessuraDoTraço = 10; // Espessura normal
  const espessuraDoBrilho = 14; // Espessura do brilho (maior)
  const opacidadeDoBrilho = 0.35; // Transparência do brilho

  // Parâmetros do SVG (dimensões e centro)
  const larguraSvg = 230;
  const alturaSvg = 120; // Semicírculo
  const centroX = larguraSvg / 2;
  const centroY = alturaSvg - 5; // Ajuste para posicionamento

  // Cálculo dos ângulos
  const anguloInicial = -90; // Esquerda
  const anguloFinal = anguloInicial + (180 * porcentagem) / 100; // Final baseado na porcentagem

  // Definição dos Caminhos SVG
  const trilhaPath = describeArc(centroX, centroY, raio, -90, 90);
  const progressoPath = describeArc(centroX, centroY, raio, anguloInicial, anguloFinal);

  return (
    <View style={styles.container}>
      <Text style={styles.textoCabecalho}>Uso do Orçamento</Text>

      <View style={styles.containerMedidor}>
        <Svg width={larguraSvg} height={alturaSvg}>
          {/* Trilha do Medidor (Arco Escuro) */}
          <Path
            d={trilhaPath}
            fill="none"
            stroke="#2C3440" // Cor da trilha escura
            strokeWidth={espessuraDoTraço}
            strokeLinecap="round"
          />
          {/* Camada de Brilho (Wider, Semi-transparente) */}
          <Path
            d={progressoPath}
            fill="none"
            stroke="#17E08F" // Cor verde brilhante
            strokeWidth={espessuraDoBrilho}
            strokeLinecap="round"
            strokeOpacity={opacidadeDoBrilho}
          />
          {/* Camada de Progresso (Narrower, Opaca) */}
          <Path
            d={progressoPath}
            fill="none"
            stroke="#17E08F" // Mesma cor verde
            strokeWidth={espessuraDoTraço}
            strokeLinecap="round"
          />
        </Svg>
        {/* Texto de Porcentagem, centralizado dentro da área do SVG */}
        <View style={styles.containerTexto}>
            <Text style={styles.textoPorcentagem}>{porcentagem}%</Text>
            <Text style={styles.textoSubCabecalho}>do orçamento usado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141a22', // Cor de fundo escura do card
    borderRadius: 20,
    padding: 20,
    margin: 10,
    width: 350, // Largura total do card
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10, // Para Android
  },
  textoCabecalho: {
    color: '#AAB3C0',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  containerMedidor: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 190, // Garante espaço suficiente para o medidor
    width: '100%',
    
  },
  containerTexto: {
    position: 'absolute',
    top: 80, // Posiciona o texto dentro/embaixo do arco
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