import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { View, Text, Button, FlatList, Switch, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
=======
import { View, Text, Button, FlatList, Switch, StyleSheet, TouchableOpacity, Image, } from "react-native";
>>>>>>> 7d261cc17ec55915eb32ab65f947cde098bba767
import { db } from "../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { ActionModal } from '../src/ActionModal'

const PerfilPage = ({ navigation }) => {
  const [section, setSection] = useState("tarefas");
  const [empresaId, setEmpresaId] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [funcionario, setFuncionario] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTarefa, setSelectedTarefa] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);



  // abrir modal
  const openModalWithTarefa = (tarefa) => {
    setSelectedTarefa(tarefa);
    setVisibleModal(true);
  };

  //--------- 


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
      const tarefasSnapshot = await getDocs(
        collection(db, `empresas/${empresaId}/tarefas`)
      );
      const tarefasData = tarefasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTarefas(tarefasData);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
  };

  const fetchPerfil = async () => {
    try {
      const usuario = JSON.parse(await AsyncStorage.getItem("usuario"));
      const funcionariosRef = collection(
        db,
        `empresas/${empresaId}/funcionarios`
      );
      const funcionariosSnapshot = await getDocs(funcionariosRef);
      const funcionarioData = funcionariosSnapshot.docs
        .map((doc) => doc.data())
        .find((func) => func.email === usuario.email);

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

  const getStatusColor = (prazoFinalizacao) => {
    const currentDate = new Date();
    const deadline = new Date(prazoFinalizacao);
    const timeDiff = deadline - currentDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 0) {
      return { circleColor: "red", backgroundColor: "#303030" };
    } else if (daysDiff <= 7) {
      return { circleColor: "yellow", backgroundColor: "#303030" };
    } else {
      return { circleColor: "green", backgroundColor: "#303030" };
    }
  };



  return (
    <LinearGradient
      colors={["#1A2C36", "#291B1A", "#161616"]}
      style={styles.container}
    >
      <View style={styles.apresentacao}>
        <Text style={styles.bemvindo}>
          Olá {funcionario?.nome || "Visitante"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            section === "tarefas" && styles.activeButton,
          ]}
          onPress={() => setSection("tarefas")}
        >
          <Icon name="tasks" size={20} color="#fff" />
          <Text style={styles.buttonText}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            section === "perfil" && styles.activeButton,
          ]}
          onPress={() => setSection("perfil")}
        >
          <Icon name="user" size={20} color="#fff" />
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            section === "configuracoes" && styles.activeButton,
          ]}
          onPress={() => setSection("configuracoes")}
        >
          <Icon name="cogs" size={20} color="#fff" />
          <Text style={styles.buttonText}>Ajutes</Text>
        </TouchableOpacity>
      </View>
      {/* tarefas--------------------- */}
      {section === "tarefas" && (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const { circleColor, backgroundColor } = getStatusColor(
              item.prazoFinalizacao
            );
            return (
              <View
                style={[styles.tarefaItem, { backgroundColor }]}
              >
                <View style={styles.tarefaStatusContainer}>
                  <View
                    style={[
                      styles.statusCircle,
                      { backgroundColor: circleColor },
                    ]}
                  />
                  <Text style={styles.tarefaTitle}>
                    {item.objetivo || "Sem título"}
                  </Text>
                </View>
                <Text style={styles.tarefalider}>
                  <Icon name="child" size={20} color="#49BF6C" />
                  {item.prazoFinalizacao || "Indefinido"}
                </Text>
                <Text style={styles.tarefacolaborador}>
                  <Icon name="street-view" size={20} color="#1873C7" />
                  {item.prazoFinalizacao || "Indefinido"}
                </Text>
                <Text style={styles.tarefaPrazo}>
                  Prazo: {item.prazoFinalizacao || "Indefinido"}
                </Text>
<<<<<<< HEAD
                <TouchableOpacity style={styles.detalhes} onPress={() => openModalWithTarefa(item)}>
=======
                <TouchableOpacity style={styles.detalhes}>
>>>>>>> 7d261cc17ec55915eb32ab65f947cde098bba767
                  <Text style={styles.detalhestexto}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {section === "perfil" && funcionario && (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          data={[
            { label: "Nome", value: funcionario.nome || "Não disponível" },
            { label: "Função", value: funcionario.funcao || "Não disponível" },
            { label: "Email", value: funcionario.email || "Não disponível" },
            { label: "Telefone", value: funcionario.telefone || "Não disponível" },
            { label: "Tipo de Contratação", value: funcionario.tipoContratacao || "Não disponível" },
            { label: "CPF", value: funcionario.CPF || "Não disponível" },
            { label: "Data de Nascimento", value: funcionario.dataNascimento || "Não disponível" },
            { label: "Estado Civil", value: funcionario.estadoCivil || "Não disponível" },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.dados}>
              <Text style={styles.titulos}>{item.label}:</Text>
              <Text style={styles.perfilText}>{item.value}</Text>
            </View>
          )}
        />
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
      <Modal
  visible={visibleModal}
  transparent={true}
  onRequestClose={() => setVisibleModal(false)}
>
  <ActionModal
    handleClose={() => setVisibleModal(false)}
    empresaId={empresaId}
    tarefa={selectedTarefa}
    
  />
</Modal>


    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
    padding: 20,
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    height: "10%",
    backgroundColor: "#303030",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#fff",
    flexWrap: "wrap",
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    height: "100%",
    flexDirection: "column",

  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "regular",
  },
  tarefaItem: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
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
    color: '#fff',
    fontWeight: "bold",
    marginBottom: 5,
  },
  tarefaPrazo: {
    fontSize: 15,
    marginBottom: 5,
    color: "#fff",
<<<<<<< HEAD

=======
    
>>>>>>> 7d261cc17ec55915eb32ab65f947cde098bba767
  },
  tarefalider: {
    fontSize: 15,
    marginBottom: 5,
    color: "#fff",
  },
  tarefacolaborador: {
    fontSize: 15,
    marginBottom: 5,
    color: "#fff",
  },

  perfilContainer: {
    display: "flex",
    width: "100%",
    marginTop: 10,
    padding: 10,
  },
  perfilText: {
    fontSize: 16,
    fontWeight: "regular",
    marginBottom: 10,
    color: "#fff",
  },
  titulos: {
    fontSize: 12,
    fontWeight: "thin",
    color: "#fff",
    marginBottom: 5,
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
  dados: {
    display: "flex",
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    marginTop: 15,
    backgroundColor: "#303030",
    padding: 8,
    paddingLeft: 20,
    borderRadius: 10,
  },
  activeButton: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
  },
  retangulo: {
    width: "100%",
    height: "40%",
    justifyContent: "flex-end",
  },
  logo: {
    width: "10%",
    height: "10%",
  },

  apresentacao: {
    display: "flex",
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },

  bemvindo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  detalhes: {
    display: "flex",
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#1873C7",
    marginTop: 20,
    borderRadius: 10,
  },
  detalhestexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: "bold",
  },
});

export default PerfilPage;