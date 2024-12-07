import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const PresencaPage = () => {
  const [facing, setFacing] = useState("back"); // Alterna entre 'back' e 'front'
  const [permission, requestPermission] = useCameraPermissions();

  // Verifica se a permissão está carregando
  if (!permission) {
    return <View />;
  }

  // Solicita permissão se ainda não foi concedida
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera.</Text>
        <Button title="Conceder permissão" onPress={requestPermission} />
      </View>
    );
  }

  // Alterna entre câmera frontal e traseira
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Trocar Câmera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "center",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default PresencaPage;