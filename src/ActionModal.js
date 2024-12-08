import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";  // Importando o Checkbox da react-native-paper
import Icon from "react-native-vector-icons/FontAwesome";

export function ActionModal({ handleClose, tarefa }) {
  const [checked, setChecked] = useState([false, false]);  // Controlando os estados dos checkboxes

  const handleCheckboxChange = (index) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.fundo} onPress={handleClose} />
      <View style={styles.content2}>
        <View style={styles.content}>
          <Text style={styles.modalTitle}>Detalhes da Tarefa:</Text>
          {tarefa ? (
            <>
              <View style={styles.content3}>
                <Text style={styles.tarefaTitle}>Objetivo: {tarefa.objetivo || "Sem título"}</Text>
                <Text style={styles.tarefaPrazo}>Prazo: {tarefa.prazoFinalizacao || "Indefinido"}</Text>
                <Text style={styles.tarefalider}><Icon name="child" size={30} color="#49BF6C" /> Lider</Text>
                <Text style={styles.tarefacolaborador}><Icon name="street-view" size={30} color="#1873C7" /> Colaboradores</Text>
              </View>

              <View style={styles.metas}>
                <Text style={styles.titulometas}>Metas:</Text>
                <View style={styles.metas2}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={checked[0] ? 'checked' : 'unchecked'}  // Verifica se o checkbox está marcado ou não
                      onPress={() => handleCheckboxChange(0)}  // Altera o estado do checkbox
                      color="#49BF6C"
                      style={styles.input}
                    />
                    <Text style={styles.label}>Tarefa 1</Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={checked[1] ? 'checked' : 'unchecked'}  // Verifica se o checkbox está marcado ou não
                      onPress={() => handleCheckboxChange(1)}  // Altera o estado do checkbox
                      color="#49BF6C"
                      style={styles.input}
                    />
                    <Text style={styles.label}>Tarefa 2</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.tarefaTitulo}>Nenhuma tarefa selecionada.</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.fundo} onPress={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fundo: {
      width: "100%",
      height: "22%",
      zIndex: 9,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content2: {
      width: "100%",
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 10,
    },
    content: {
      width: "100%",
      flex: 1, // Permite que o conteúdo ocupe o espaço necessário
      paddingVertical: 20,
      paddingHorizontal: 10,
      backgroundColor: "#131A2F",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#fff",
      overflow: "hidden", // Garante que conteúdo adicional não vaze
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#fff",
      textAlign: "center", // Centraliza o título
    },
    tarefaTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 10,
    },
    tarefaPrazo: {
      fontSize: 14,
      color: "#fff",
      marginBottom: 20,
    },
    tarefalider: {
      fontSize: 16,
      color: "#fff",
      marginBottom: 10,
    },
    tarefacolaborador: {
      fontSize: 16,
      color: "#fff",
      marginBottom: 10,
    },
    metas: {
      flex: 1,
      width: "100%",
      backgroundColor: "#131A2F",
      flexDirection: "column",
      padding: 10,
    },
    titulometas: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 10,
      textAlign: "center", // Centraliza o título das metas
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    label: {
      fontSize: 15,
      color: "#fff",
      marginLeft: 10,
    },
    metas2: {
      width: "100%",
      flexDirection: "column", // Alinha checkboxes em coluna para evitar cortes
      gap: 10, // Espaçamento entre os itens
    },
  });