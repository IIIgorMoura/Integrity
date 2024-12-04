import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PerfilPage from "../pages/PerfilPage";
import PresencaPage from "../pages/PresencaPage";
import ChatPage from "../pages/ChatPage";

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Perfil" component={PerfilPage} />
    <Tab.Screen name="Presença" component={PresencaPage} />
    <Tab.Screen name="Chat" component={ChatPage} />
  </Tab.Navigator>
);

export default BottomTabsNavigator;
