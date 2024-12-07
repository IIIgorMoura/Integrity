import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";

const PresencaPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // Indica se o QR code já foi escaneado

  // Solicitar permissão para usar a câmera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Função chamada após escanear o QR code
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true); // Bloqueia escaneamentos adicionais até que o estado seja resetado
    Alert.alert("QR Code Escaneado!", `Tipo: ${type}\nConteúdo: ${data}`, [
      { text: "OK", onPress: () => setScanned(false) }, // Reseta o estado
    ]);
  };

  // Caso o usuário não tenha permitido acesso à câmera
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permissão para usar a câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera.</Text>
        <Button title="Conceder permissão" onPress={() => Camera.requestCameraPermissionsAsync()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // Escaneia apenas QR Codes
        }}
        style={styles.camera}
      />
      {scanned && (
        <Button title={"Escanear Novamente"} onPress={() => setScanned(false)} />
      )}
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
});

export default PresencaPage;
