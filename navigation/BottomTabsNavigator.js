import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from 'react-native';
import { StyleSheet } from "react-native";
import PresencaPage from "../pages/PresencaPage";
import PerfilPage from "../pages/PerfilPage";
import ChatPage from "../pages/ChatPage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Biblioteca de ícones

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === "Presença") {
          iconName = "event-available";
        } else if (route.name === "Perfil") {
          iconName = "person";
        } else if (route.name === "Chat") {
          iconName = "chat";
        }

        return <Icon name={iconName} size={size} color={color} style={styles.tabIcon} />;
      },
      tabBarActiveTintColor: styles.tabLabelActive.color, // Cor do ícone ativo
      tabBarInactiveTintColor: styles.tabLabel.color, // Cor do ícone inativo
      tabBarStyle: styles.tabBar, // Estilo da barra flutuante
    })}
  >
    <Tab.Screen name="Presença" component={PresencaPage} 
    options={{
      headerTitle: () => null, 
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0, 
        shadowOpacity: 0,
      },
      headerTransparent: true, 
    }}
    />
    <Tab.Screen
  name="Perfil"
  component={PerfilPage}
  options={{
    headerTitle: () => null, 
    headerRight: () => (
      <Image
        source={require('../assets/logo.png')}
        style={{
          width: "30%",
          height: "80%", 
          marginTop: 20,
          marginRight: 16,
          resizeMode: 'contain', 
        }}
      />
    ),
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0, 
      shadowOpacity: 0,
    },
    headerTransparent: true, 
  }}
/>
    <Tab.Screen name="Chat" component={ChatPage} 
    options={{
      headerTitle: () => null, 
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0, 
        shadowOpacity: 0,
      },
      headerTransparent: true, 
    }}
    />
  </Tab.Navigator>
);

// Constante de estilos
const styles = StyleSheet.create({
  tabBar: {
    height: 55, // Altura da barra
    backgroundColor: "#222222", // Cor de fundo
    borderTopColor:"white",
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#757575", // Cor padrão do texto inativo
  },
  tabLabelActive: {
    color: "#468FB8", // Cor do texto ativo
  },
});


export default BottomTabsNavigator;