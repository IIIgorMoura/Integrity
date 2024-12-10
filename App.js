import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import { StatusBar } from "react-native";

const App = () => (
  <NavigationContainer>
    {/* StatusBar transparente */}
    <StatusBar 
      translucent 
      backgroundColor="transparent" 
      barStyle="light-content" 
    />
    <MainNavigator />
  </NavigationContainer>
);

export default App;
