import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../configs/firebaseConfig";

const PresencaPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [empresaInfo, setEmpresaInfo] = useState({ nome: "", endereco: "" });
  const [userLocation, setUserLocation] = useState(null);

  // Solicitar permissão para câmera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Solicitar permissão para localização
  useEffect(() => {
    const getLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão Negada", "Precisamos de acesso à sua localização.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };
    getLocationPermissions();
  }, []);

  // Buscar informações da empresa
  useEffect(() => {
    const fetchEmpresaInfo = async () => {
      const empresaId = await AsyncStorage.getItem("empresaId");
      if (empresaId) {
        try {
          const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
          if (empresaDoc.exists()) {
            const data = empresaDoc.data();
            setEmpresaInfo({
              nome: data.nomeEmpresa || "Nome não disponível",
              endereco: data.enderecoEmpresa || "Endereço não disponível",
            });
          } else {
            Alert.alert("Erro", "Empresa não encontrada.");
          }
        } catch (error) {
          Alert.alert("Erro", "Não foi possível buscar as informações da empresa.");
          console.error("Erro ao buscar informações da empresa:", error);
        }
      }
    };
    fetchEmpresaInfo();
  }, []);

  const handleBarcodeScanned = () => {
    setScanned(true);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão negada para usar a câmera.</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.infoTitle}>Nome da Empresa</Text>
            <Text style={styles.infoText}>{empresaInfo.nome}</Text>

            <Text style={styles.infoTitle}>Endereço da Empresa</Text>
            <Text style={styles.infoText}>{empresaInfo.endereco}</Text>
          </View>
          {userLocation && (
            <View>
              <Text style={styles.infoTitle}>Sua Localização</Text>
              <Text style={styles.infoText}>
                Latitude: {userLocation.latitude.toFixed(6)}, Longitude: {userLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Presença Marcada!", "Presença registrada com sucesso.")}
            >
              <MaterialIcons name="check" size={20} color="white" />
              <Text style={styles.buttonText}>Marcar Presença</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setScanned(false)}
            >
              <MaterialIcons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>Escanear Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          style={styles.camera}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Escaneie o QR Code</Text>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayText: { color: "white", fontSize: 18, fontWeight: "bold" },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  infoTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  infoText: { fontSize: 16, marginBottom: 20, color: "#fff" },
  buttonContainer: { marginTop: 20 },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
    width: 250,
  },
  secondaryButton: { backgroundColor: "#6C757D" },
  buttonText: { color: "white", fontSize: 16, marginLeft: 10 },
});

export default PresencaPage;
