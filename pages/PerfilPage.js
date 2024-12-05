import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

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

  // Função para calcular a cor da bolinha e o fundo da tarefa
  const getStatusColor = (prazoFinalizacao) => {
    const currentDate = new Date();
    const deadline = new Date(prazoFinalizacao);
    const timeDiff = deadline - currentDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24); // Convertendo de milissegundos para dias

    if (daysDiff < 0) {
      return { circleColor: "red", backgroundColor: "#d3d3d3" }; // Vencida - bolinha vermelha, fundo cinza
    } else if (daysDiff <= 7) {
      return { circleColor: "yellow", backgroundColor: "#fff" }; // Faltando 7 dias ou menos - bolinha amarela
    } else {
      return { circleColor: "green", backgroundColor: "#fff" }; // Dentro do prazo - bolinha verde
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setSection("tarefas")}>
          <Icon name="tasks" size={20} color="#fff" />
          <Text style={styles.buttonText}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSection("perfil")}>
          <Icon name="user" size={20} color="#fff" />
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSection("configuracoes")}>
          <Icon name="cogs" size={20} color="#fff" />
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>
      </View>

      {section === "tarefas" && (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const { circleColor, backgroundColor } = getStatusColor(item.prazoFinalizacao); // Pegando a cor da bolinha e fundo
            return (
              <View style={[styles.tarefaItem, { backgroundColor }]}>
                <View style={styles.tarefaStatusContainer}>
                  <View style={[styles.statusCircle, { backgroundColor: circleColor }]} />
                  <Text style={styles.tarefaTitle}>{item.objetivo}</Text>
                </View>
                <Text style={styles.tarefaPrazo}>Prazo: {item.prazoFinalizacao}</Text>
              </View>
            );
          }}
        />
      )}

      {section === "perfil" && funcionario && (
        <View style={styles.perfilContainer}>
          <Text style={styles.perfilText}>Nome: {funcionario.nome}</Text>
          <Text style={styles.perfilText}>Função: {funcionario.funcao}</Text>
          <Text style={styles.perfilText}>Email: {funcionario.email}</Text>
          <Text style={styles.perfilText}>Telefone: {funcionario.telefone}</Text>
          <Text style={styles.perfilText}>Tipo de Contratação: {funcionario.tipoContratacao}</Text>
          <Text style={styles.perfilText}>CPF: {funcionario.CPF}</Text>
          <Text style={styles.perfilText}>Data de Nascimento: {funcionario.dataNascimento}</Text>
          <Text style={styles.perfilText}>Estado Civil: {funcionario.estadoCivil}</Text>
        </View>
      )}

      {section === "configuracoes" && (
        <View style={styles.configContainer}>
          <Text style={styles.configText}>Modo Escuro:</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.buttonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#155576",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tarefaItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tarefaStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  tarefaTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tarefaPrazo: {
    fontSize: 14,
    color: "#555",
  },
  perfilContainer: {
    marginTop: 20,
  },
  perfilText: {
    fontSize: 16,
    marginBottom: 8,
  },
  configContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  configText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default PerfilPage;
