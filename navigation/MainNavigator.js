import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../pages/LoginPage";
import BottomTabsNavigator from "./BottomTabsNavigator";

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="Perfil" component={BottomTabsNavigator} />
  </Stack.Navigator>
);

export default MainNavigator;
