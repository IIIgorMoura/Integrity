import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../configs/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifica se o usuário é um administrador
      const empresasRef = collection(db, "empresas");
      const adminQuery = query(empresasRef, where("uidAdministrador", "==", user.uid));
      const adminSnapshot = await getDocs(adminQuery);

      if (!adminSnapshot.empty) {
        adminSnapshot.forEach(async (doc) => {
          const empresaId = doc.id;
          const empresaData = doc.data();
          await AsyncStorage.setItem("usuario", JSON.stringify(user));
          await AsyncStorage.setItem("empresaId", empresaId);
          navigation.navigate("Perfil");
        });
        return;
      }

      // Verifica se o usuário é funcionário
      const empresasSnapshot = await getDocs(empresasRef);
      let empresaIdFuncionario = null;

      for (const empresaDoc of empresasSnapshot.docs) {
        const empresaId = empresaDoc.id;
        const funcionariosRef = collection(db, `empresas/${empresaId}/funcionarios`);
        const funcionarioQuery = query(funcionariosRef, where("email", "==", email));
        const funcionarioSnapshot = await getDocs(funcionarioQuery);

        if (!funcionarioSnapshot.empty) {
          empresaIdFuncionario = empresaId;
          break;
        }
      }

      if (empresaIdFuncionario) {
        await AsyncStorage.setItem("usuario", JSON.stringify(user));
        await AsyncStorage.setItem("empresaId", empresaIdFuncionario);
        navigation.navigate("Perfil");
      } else {
        Alert.alert("Erro", "Nenhuma empresa associada ao seu usuário.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Falha ao realizar login. Verifique suas credenciais.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
      />
      <Text>Senha:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
      />
      <Button title="Entrar" onPress={loginUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 10 },
});

export default LoginPage;
