import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const questionsAndAnswers = [
  {
    id: '1',
    question: 'Como acesso meu perfil?',
    answer: 'Vá até a página de "perfil" e clique em "meu perfil".',
  },
  {
    id: '2',
    question: 'Como vejo minhas tarefas?',
    answer: 'Vá para tela de "perfil" e logo será exibido as tarefas',
  },
  {
    id: '3',
    question: 'Como verificar a presença?',
    answer: 'A presença pode ser verificada na página inicial, na seção "Marcadores de Presença".',
  },
  {
    id: '4',
    question: 'Como usar a tela de "perfil"?',
    answer: 'Na tela de perfil existem três abas para você navegar, "Tarefas", "meu perfil", "configurações". A tela de configuração é a única que você pode editar, nela existe o modo de visualização, tema claro e tema escuro, e a opção para sair da sua conta.',
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showQuestionSection, setShowQuestionSection] = useState(true);
  const [isFeedbackAsked, setIsFeedbackAsked] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const flatListRef = useRef();

  // Adiciona a saudação inicial
  useEffect(() => {
    setMessages([{ id: 'greeting', text: 'Olá, como posso te ajudar?', type: 'received' }]);
  }, []);

  // Função para lidar com a seleção de uma dúvida
  const handleOptionSelect = (item) => {
    const newMessages = [
      ...messages,
      { id: Math.random().toString(), text: item.question, type: 'sent' },
      { id: Math.random().toString(), text: item.answer, type: 'received' },
    ];
    setMessages(newMessages);
    setShowQuestionSection(false); // Esconde as perguntas
    setIsFeedbackAsked(true); // Mostra a pergunta de feedback
  };

  // Função para lidar com a resposta sobre a utilidade da resposta
  const handleResolution = (resolved) => {
    if (resolved) {
      setMessages([
        ...messages,
        { id: Math.random().toString(), text: 'Que bom que conseguimos te ajudar!', type: 'received' },
      ]);
      setIsResolved(true);
      setShowQuestionSection(true); // Volta para a área de dúvidas
      setIsFeedbackAsked(false); // Esconde a pergunta de feedback
    } else {
      setMessages([
        ...messages,
        { id: Math.random().toString(), text: 'Vou te encaminhar para um atendente. Um momento...', type: 'received' },
      ]);
      setIsFeedbackAsked(false); // Esconde a pergunta de feedback
    }
  };

  // Função para enviar uma mensagem
  const handleSend = () => {
    if (inputText.trim()) {
      const newMessages = [
        ...messages,
        { id: Math.random().toString(), text: inputText, type: 'sent' },
      ];
      setMessages(newMessages);
      setInputText('');

      // Verifica se a mensagem é um pedido de suporte
      if (inputText.toLowerCase().includes('suporte') || inputText.toLowerCase().includes('atendente')) {
        setMessages([
          ...newMessages,
          { id: Math.random().toString(), text: 'Você será encaminhado para um atendente. Um momento...', type: 'received' },
        ]);
        return; // Interrompe a execução caso o suporte seja solicitado
      }

      // Verifica se a mensagem não é reconhecida
      setMessages([
        ...newMessages,
        { id: Math.random().toString(), text: 'Desculpe, não consegui entender sua dúvida.', type: 'received' },
      ]);
    }
  };

  // Função para alternar a visibilidade da seção de perguntas
  const toggleQuestionSection = () => {
    setShowQuestionSection((prevState) => !prevState);
  };

  // Garantir que a lista role para a última mensagem
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[styles.messageBubble, item.type === 'sent' ? styles.sent : styles.received]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {isFeedbackAsked && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>A resposta foi útil?</Text>
          <TouchableOpacity style={styles.feedbackButton} onPress={() => handleResolution(true)}>
            <Text style={styles.feedbackButtonText}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedbackButton} onPress={() => handleResolution(false)}>
            <Text style={styles.feedbackButtonText}>Não</Text>
          </TouchableOpacity>
        </View>
      )}

      {showQuestionSection && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Qual a sua dúvida?</Text>
          {questionsAndAnswers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.questionBubble}
              onPress={() => handleOptionSelect(item)}
            >
              <Text style={styles.questionText}>{item.question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.toggleButton} onPress={toggleQuestionSection}>
        <Text style={styles.toggleButtonText}>
          {showQuestionSection ? 'Recolher Dúvidas' : 'Mostrar Dúvidas'}
        </Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="attach-file" size={24} color="#aaa" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite uma mensagem"
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
          <Icon name="send" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: 30,
  },
  chatContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  questionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  questionBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  questionText: {
    fontSize: 14,
    color: '#333',
  },
  feedbackContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  feedbackButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    color: '#333',
  },
  iconButton: {
    padding: 5,
  },
  toggleButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
});
