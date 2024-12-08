import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
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

  const marcarPresenca = async () => {
    try {
      // Recuperar os dados do funcionário logado
      const funcionarioId = await AsyncStorage.getItem("funcionarioId");
      const empresaId = await AsyncStorage.getItem("empresaId");
  
      if (!funcionarioId || !empresaId) {
        Alert.alert("Erro", "Funcionário ou empresa não encontrados.");
        return;
      }
  
      // Data e horário atuais
      const hoje = new Date();
      const dataAtual = hoje.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
      const horarioAtual = hoje.toTimeString().split(" ")[0]; // Formato: HH:MM:SS
  
      // Referência à subcoleção `datasPresentes`
      const funcionarioDocRef = doc(db, `empresas/${empresaId}/funcionarios`, funcionarioId);
      const presencaSubcollectionRef = collection(funcionarioDocRef, "datasPresentes");
  
      // Verificar se o documento do dia já existe
      const presencaDocRef = doc(presencaSubcollectionRef, dataAtual);
      const presencaDoc = await getDoc(presencaDocRef);
  
      if (presencaDoc.exists()) {
        Alert.alert("Aviso", "Presença já registrada para hoje.");
        return;
      }
  
      // Criar novo documento para a presença
      await setDoc(presencaDocRef, {
        data: dataAtual,
        horarioEntrada: horarioAtual,
        localizacao: userLocation || null,
      });
  
      Alert.alert("Sucesso", "Presença registrada com sucesso.");
    } catch (error) {
      console.error("Erro ao marcar presença:", error);
      Alert.alert("Erro", "Não foi possível registrar a presença.");
    }
  };

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
          <View style={styles.infoLargura}>
            <Text style={styles.infoTitle}>Nome da Empresa</Text>
            <Text style={styles.infoText}>{empresaInfo.nome}</Text>

            <Text style={styles.infoTitle}>Endereço da Empresa</Text>
            <Text style={styles.infoText}>{empresaInfo.endereco}</Text>
          </View>
          {userLocation && (
            <View style={styles.infoLargura}>
              <Text style={styles.infoTitle}>Sua Localização</Text>
              <Text style={styles.infoText}>
                Latitude: {userLocation.latitude.toFixed(6)}, Longitude: {userLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={marcarPresenca}>
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
  infoLargura: { width: '80%'},
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
