import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatPage = () => (
  <View style={styles.container}>
    <Text>Bem-vindo ao chat.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatPage;
