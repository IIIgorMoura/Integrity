import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";
import {StatusBar} from 'react-native';

const App = () => (
  <NavigationContainer>
    <StatusBar style="auto"/>
    <MainNavigator />
  </NavigationContainer>
);

export default App;
