import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const PresencaPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [location, setLocation] = useState(null);

  // Coordenadas da empresa (exemplo, substituir pelas reais)
  const empresaLocation = {
    latitude: -23.55052, // Latitude da empresa
    longitude: -46.633308, // Longitude da empresa
  };

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
      return currentLocation.coords;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar sua localização.");
      return null;
    }
  };

  // Função chamada após escanear o QR code
  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    const coords = await getCurrentLocation();

    if (coords) {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        empresaLocation.latitude,
        empresaLocation.longitude
      );

      if (distance <= 0.1) {
        // Presença confirmada se distância for <= 100 metros
        Alert.alert("Presença Marcada!", "Você está na localização correta.");
      } else {
        Alert.alert("Tente Novamente!", "Sua localização não é a mesma da empresa.");
      }
    } else {
      Alert.alert("Erro", "Não foi possível verificar sua localização.");
    }
    setScanned(false);
  };

  // Calcular a distância entre duas coordenadas (em km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permissão para usar a câmera...</Text></View>;
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
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={styles.camera}
      >
        {/* Sobreposição escurecida */}
        <View style={styles.overlay}>
          <Text style={styles.title}>Escaneie o QR Code</Text>
        </View>

        {/* Botão de "Marcar Presença" */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Instrução", "Aponte a câmera para o QR Code para marcar presença.")}
          >
            <MaterialIcons name="check" size={20} color="white" />
            <Text style={styles.buttonText}>Marcar Presença</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default PresencaPage;
