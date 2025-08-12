import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importa o componente de tempo real (corrigido para coincidir com o nome do arquivo e do componente)
import TempoReal from './tempoReal'; 

// Importa o componente de registro de marcadores
import RegistroDeMarcadores from './registrodemarcadores';

// Cria a instância do navegador de abas
const Tabs = createBottomTabNavigator();

// Componente principal da aplicação
export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // oculta o cabeçalho
          tabBarIcon: ({ color, size }) => {
            let iconName;

            // Define o ícone para cada rota
            if (route.name === 'Tempo Real') {
              iconName = 'clock-o'; // Ícone de relógio
            } else if (route.name === 'Registro de Marcadores') {
              iconName = 'pencil'; // Ícone de caneta
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Aba para o componente de tempo real */}
        <Tabs.Screen name="Tempo Real" component={TempoReal} />

        {/* Aba para o componente de registro de marcadores */}
        <Tabs.Screen name="Registro de Marcadores" component={RegistroDeMarcadores} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
