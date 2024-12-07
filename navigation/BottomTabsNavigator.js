import React from "react";
import { Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PresencaPage from "../pages/PresencaPage";
import PerfilPage from "../pages/PerfilPage";
import ChatPage from "../pages/ChatPage";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => (
  <Tab.Navigator>

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
