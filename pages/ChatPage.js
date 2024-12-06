import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { db } from "../configs/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [funcionarioId, setFuncionarioId] = useState(null); // Variável para armazenar o funcionarioId

  // Carregar dados do usuário e empresa
  useEffect(() => {
    const loadData = async () => {
      const storedUsuario = await AsyncStorage.getItem("usuario");
      const storedEmpresaId = await AsyncStorage.getItem("empresaId");
      const storedFuncionarioId = await AsyncStorage.getItem("funcionarioId"); // Obtém o funcionarioId

      if (storedUsuario) {
        setUser(JSON.parse(storedUsuario));
      }
      if (storedEmpresaId) {
        setEmpresaId(storedEmpresaId);
      }
      if (storedFuncionarioId) {
        setFuncionarioId(storedFuncionarioId); // Armazena o funcionarioId
      }
    };

    loadData();
  }, []);

  // Ouvir as mensagens em tempo real
  useEffect(() => {
    if (empresaId && funcionarioId) {
      const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map(doc => ({
          id: doc.id,  // Incluindo o id do documento
          ...doc.data(),
        }));
        setMessages(messagesList);
      });

      // Limpar o listener quando a tela for desmontada
      return () => unsubscribe();
    }
  }, [empresaId, funcionarioId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      // Garantir que o userName esteja definido
      const userName = user.displayName || "Usuário desconhecido"; // Valor padrão se displayName não estiver definido

      const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);

      // Adicionar a mensagem no Firestore
      await addDoc(messagesRef, {
        text: message,
        userId: user.uid,
        userName: userName, // Certificando-se que o campo userName tem um valor válido
        timestamp: new Date(),
      });

      setMessage(""); // Limpar o campo de entrada
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const renderMessageItem = ({ item }) => {
    return (
      <View style={item.userId === user.uid ? styles.sentMessage : styles.receivedMessage}>
        <Text style={styles.messageText}>{item.userName}: {item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}  // Usando o id como chave
        inverted  // Inverte a lista para que as mensagens mais recentes apareçam no fundo
        contentContainerStyle={styles.messagesContainer}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  messagesContainer: {
    paddingTop: 10,
    paddingBottom: 60, // Espaço para o campo de entrada
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#264357",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#264357",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatPage;
