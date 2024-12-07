import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Location from "expo-location";

const PresencaPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // Indica se o QR code já foi escaneado
  const [location, setLocation] = useState(null); // Estado para armazenar a localização do usuário

  // Solicitar permissão para usar a câmera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Solicitar permissão para acessar a localização
  useEffect(() => {
    const getLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão Negada", "Precisamos de acesso à sua localização para registrar presença.");
        return;
      }
    };

    getLocationPermissions();
  }, []);

  // Capturar a localização atual
  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      return currentLocation.coords; // Retorna latitude e longitude
    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar sua localização.");
      return null;
    }
  };

  // Função chamada após escanear o QR code
  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true); // Bloqueia escaneamentos adicionais até que o estado seja resetado

    // Captura a localização atual
    const coords = await getCurrentLocation();
    if (coords) {
      const { latitude, longitude } = coords;
      Alert.alert(
        "QR Code Escaneado!",
        `Tipo: ${type}\nConteúdo: ${data}\n\nLocalização:\nLatitude: ${latitude}\nLongitude: ${longitude}`,
        [{ text: "OK", onPress: () => setScanned(false) }] // Reseta o estado
      );
    } else {
      setScanned(false);
    }
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