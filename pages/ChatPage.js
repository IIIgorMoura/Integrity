import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import { db } from "../configs/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Entypo } from "@expo/vector-icons";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [funcionarioId, setFuncionarioId] = useState(null);
  const flatListRef = useRef(null); // Referência para o FlatList

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

  useEffect(() => {
    if (empresaId && funcionarioId) {
      const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });

      return () => unsubscribe();
    }
  }, [empresaId, funcionarioId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const userName = user?.displayName || "Usuário desconhecido";
      const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);

      await addDoc(messagesRef, {
        text: message,
        userId: user.uid,
        userName: userName,
        timestamp: new Date().toISOString(),
      });

      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const messagesRef = collection(db, `empresas/${empresaId}/funcionarios/${funcionarioId}/historicoChat`);

        await addDoc(messagesRef, {
          imageUrl: result.assets[0].uri,
          userId: user.uid,
          userName: user.displayName || "Usuário desconhecido",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessageItem = ({ item }) => (
    <View style={item.userId === user?.uid ? styles.sentMessage : styles.receivedMessage}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.imageMessage} />
      ) : (
        <Text style={styles.messageText}>
          {item.userName && item.userName !== "Usuário desconhecido" ? `${item.userName}: ` : ""}
          {item.text}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat de Suporte</Text>
        <Text style={styles.subtitle}>Fale com seu superior ou envie arquivos.</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="handled"
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
        <TouchableOpacity style={styles.clipButton} onPress={handlePickImage}>
          <Entypo name="attachment" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { padding: 20, backgroundColor: "#333", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#aaa", marginTop: 5 },
  messagesContainer: { paddingTop: 10, paddingBottom: 60 },
  sentMessage: { 
    alignSelf: "flex-end", 
    backgroundColor: "#468fb8", 
    padding: 10, 
    borderRadius: 7, 
    margin: 5, 
    width: "80%", // Limita a largura da mensagem enviada
  },
  receivedMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "gray", 
    padding: 10, 
    borderRadius: 7, 
    margin: 5, 
    width: "80%", // Limita a largura da mensagem recebida
  },
  messageText: { color: "#fff", fontSize: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: { 
    flex: 1, 
    backgroundColor: "#333", 
    color: "#fff", 
    padding: 10, 
    borderRadius: 20, 
    marginRight: 10, 
  },
  clipButton: { marginRight: 10 },
  sendButton: { backgroundColor: "#468fb8", padding: 10, borderRadius: 50 },
  imageMessage: { width: 290, height: 280, borderRadius: 10 },
});


export default ChatPage;
