import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import TempoReal from './temporeal';
import RegistroDeMarcadores from './registrodemarcadores';

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Tempo Real') {
              iconName = 'clock-o'; // Ícone de relógio
            } else if (route.name === 'Registro de Marcadores') {
              iconName = 'pencil'; // Ícone de caneta
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="Tempo Real" component={TempoReal} />
        <Tabs.Screen name="Registro de Marcadores" component={RegistroDeMarcadores} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
