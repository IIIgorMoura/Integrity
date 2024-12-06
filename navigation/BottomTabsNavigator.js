import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PresencaPage from "../pages/PresencaPage";
import PerfilPage from "../pages/PerfilPage";
import ChatPage from "../pages/ChatPage";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importando a biblioteca de ícones

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => (
  <Tab.Navigator initialRouteName="Perfil">
    <Tab.Screen 
      name="Presença" 
      component={PresencaPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="event-available" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Perfil"
      component={PerfilPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Chat" 
      component={ChatPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chat" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabsNavigator;
