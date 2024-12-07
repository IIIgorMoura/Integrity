import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
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
  
      // Verifica se o usuário é administrador
      const empresasRef = collection(db, "empresas");
      const adminQuery = query(empresasRef, where("uidAdministrador", "==", user.uid));
      const adminSnapshot = await getDocs(adminQuery);
  
      if (!adminSnapshot.empty) {
        adminSnapshot.forEach(async (doc) => {
          const empresaId = doc.id;
          await AsyncStorage.setItem("usuario", JSON.stringify(user));
          await AsyncStorage.setItem("empresaId", empresaId);
          navigation.navigate("Perfil"); // Redirecionar para perfil do administrador
        });
        return;
      }
  
      // Verifica se o usuário é funcionário
      let empresaIdFuncionario = null;
      let funcionarioId = null;
      const empresasSnapshot = await getDocs(empresasRef);
      for (const empresaDoc of empresasSnapshot.docs) {
        const empresaId = empresaDoc.id;
        const funcionariosRef = collection(db, `empresas/${empresaId}/funcionarios`);
        const funcionarioQuery = query(funcionariosRef, where("email", "==", email));
        const funcionarioSnapshot = await getDocs(funcionarioQuery);
  
        if (!funcionarioSnapshot.empty) {
          empresaIdFuncionario = empresaId;
          funcionarioSnapshot.forEach(doc => {
            funcionarioId = doc.id; // Obtém o id do funcionário específico
          });
          break;
        }
      }
  
      if (empresaIdFuncionario && funcionarioId) {
        await AsyncStorage.setItem("usuario", JSON.stringify(user));
        await AsyncStorage.setItem("empresaId", empresaIdFuncionario);
        await AsyncStorage.setItem("funcionarioId", funcionarioId); // Armazena o funcionarioId
        navigation.navigate("Perfil"); // Redirecionar para perfil do funcionário
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
      <LinearGradient colors={['#155576b3', '#46201B']} style={styles.bemvindo}>

        <Text style={styles.text}>BEM-VINDO!</Text>
        <Text style={styles.text2}>Faça login para continuar</Text>
      </LinearGradient>
      <View style={styles.inputs}>
        <View style={styles.inputos}>
          <Text style={styles.Texto}>Email:</Text>
        </View>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
        />
        <View style={styles.inputos}>
          <Text style={styles.Texto}>Senha:</Text>
        </View>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#161616",
  },
  Texto: {
   fontWeight:"thin", 
    fontSize: 16,
    color: '#fff',
  },
  inputs: {
    display: 'flex',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 20,
    padding: 10,
    width: "100%",
    backgroundColor: '#161616',
    fontSize: 16,
    color: '#fff',
    
  },
  inputos: {
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bemvindo: {
    paddingTop: '20%',
    paddingBottom: '10%',
    height: '35%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 82,
    borderBottomLeftRadius: 82,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: '#fff',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 18,
   fontWeight: "light",
    color: '#fff',
  },
  button: {
    backgroundColor: '#264357',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20, 
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;