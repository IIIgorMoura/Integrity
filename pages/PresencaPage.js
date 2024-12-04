import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PresencaPage = () => (
  <View style={styles.container}>
    <Text>Marque sua presença aqui.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PresencaPage;
