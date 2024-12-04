import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Switch, StyleSheet } from "react-native";
import { db } from "../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PerfilPage = ({ navigation }) => {
  const [section, setSection] = useState("tarefas");
  const [empresaId, setEmpresaId] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [funcionario, setFuncionario] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchEmpresaId = async () => {
      const storedEmpresaId = await AsyncStorage.getItem("empresaId");
      setEmpresaId(storedEmpresaId);
    };

    fetchEmpresaId();
  }, []);

  useEffect(() => {
    if (empresaId) {
      if (section === "tarefas") {
        fetchTarefas();
      } else if (section === "perfil") {
        fetchPerfil();
      }
    }
  }, [section, empresaId]);

  const fetchTarefas = async () => {
    try {
      const tarefasSnapshot = await getDocs(collection(db, `empresas/${empresaId}/tarefas`));
      const tarefasData = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTarefas(tarefasData);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
  };

  const fetchPerfil = async () => {
    try {
      const usuario = JSON.parse(await AsyncStorage.getItem("usuario"));
      const funcionariosRef = collection(db, `empresas/${empresaId}/funcionarios`);
      const funcionariosSnapshot = await getDocs(funcionariosRef);
      const funcionarioData = funcionariosSnapshot.docs
        .map(doc => doc.data())
        .find(func => func.email === usuario.email);

      if (funcionarioData) {
        setFuncionario(funcionarioData);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do funcionário:", err);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("empresaId");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Tarefas" onPress={() => setSection("tarefas")} />
        <Button title="Meu Perfil" onPress={() => setSection("perfil")} />
        <Button title="Configurações" onPress={() => setSection("configuracoes")} />
      </View>

      {section === "tarefas" && (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tarefaItem}>
              <Text>{item.objetivo}</Text>
              <Text>Prazo: {item.prazoFinalizacao}</Text>
            </View>
          )}
        />
      )}

      {section === "perfil" && funcionario && (
        <View>
          <Text>Nome: {funcionario.nome}</Text>
          <Text>Função: {funcionario.funcao}</Text>
          <Text>Email: {funcionario.email}</Text>
          <Text>Telefone: {funcionario.telefone}</Text>
          <Text>Função: {funcionario.tipoContratacao}</Text>
          <Text>Função: {funcionario.CPF}</Text>
          <Text>Função: {funcionario.dataNascimento}</Text>
          <Text>Função: {funcionario.estadoCivil}</Text>
          
        </View>
      )}

      {section === "configuracoes" && (
        <View>
          <Text>Modo Escuro:</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          <Button title="Sair da Conta" onPress={logout} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  tarefaItem: { padding: 8, borderWidth: 1, marginBottom: 8 },
});

export default PerfilPage;
