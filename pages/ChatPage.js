import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { db } from "../configs/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [funcionarioId, setFuncionarioId] = useState(null);
  const flatListRef = useRef(null); // Referência para o FlatList

  // Carregar dados do usuário e empresa
  useEffect(() => {
    const loadData = async () => {
      const storedUsuario = await AsyncStorage.getItem("usuario");
      const storedEmpresaId = await AsyncStorage.getItem("empresaId");
      const storedFuncionarioId = await AsyncStorage.getItem("funcionarioId");

      if (storedUsuario) {
        setUser(JSON.parse(storedUsuario));
      }
      if (storedEmpresaId) {
        setEmpresaId(storedEmpresaId);
      }
      if (storedFuncionarioId) {
        setFuncionarioId(storedFuncionarioId);
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
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });

      // Limpar o listener quando a tela for desmontada
      return () => unsubscribe();
    }
  }, [empresaId, funcionarioId]);

  // Função para enviar mensagens
  const sendMessage = async () => {
    if (message.trim() === "") return;
    if (!user || !user.uid) {
      console.error("Erro: Usuário não autenticado.");
      return;
    }

    try {
      const userName = user.displayName || "Usuário desconhecido"; 

      const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);

      // Adicionar a mensagem no Firestore
      await addDoc(messagesRef, {
        text: message,
        userId: user.uid,
        userName: userName,
        timestamp: Timestamp.fromDate(new Date()), // Garante o timestamp correto
      });

      setMessage(""); 
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  // Rolar automaticamente para a última mensagem
  useEffect(() => {
    // Espera o layout ser renderizado e as mensagens estarem disponíveis
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100); // Delay para garantir que as mensagens foram renderizadas
    }
  }, [messages]); // Rola quando novas mensagens são recebidas

  const renderMessageItem = ({ item }) => {
    return (
      <View style={item.userId === user.uid ? styles.sentMessage : styles.receivedMessage}>
        <Text style={styles.messageText}>
          {item.userName && item.userName !== "Usuário desconhecido" ? `${item.userName}: ` : ""}{item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Título e subtítulo */}
      <View style={styles.header}>
        <Text style={styles.title}>Chat de Suporte</Text>
        <Text style={styles.subtitle}>Fale com seu superior ou suba arquivos.</Text>
      </View>

      <FlatList
        ref={flatListRef} // Referência para o FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="handled" // Permite que a interação com a lista não seja bloqueada pelo teclado
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor="#aaa"
          onFocus={() => {
            // Garante que ao focar o campo de texto, a lista de mensagens role para o fim
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", 
  },
  header: {
    padding: 20,
    backgroundColor: "#333",
    alignItems: "center",
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  messagesContainer: {
    paddingTop: 10,
    paddingBottom: 60, // Espaço para o campo de entrada
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(70, 143, 184,  0.3)", // Cor mais transparente
    padding: 10,
    borderRadius: 7,
    margin: 5,
    maxWidth: "80%",
    shadowColor: "#000", 
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Cor mais transparente
    padding: 10,
    borderRadius: 20,
    margin: 5,
    maxWidth: "80%",
    shadowColor: "#000", 
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  messageText: {
    color: "#fff", 
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#333", 
    color: "#fff", 
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#444", 
  },
  sendButton: {
    backgroundColor: "#468fb8", 
    padding: 10,
    borderRadius: 50,
  },
});

export default ChatPage;