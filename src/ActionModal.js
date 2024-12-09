import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper"; // Importando o Checkbox da react-native-paper
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

export function ActionModal({ handleClose, tarefa, empresaId }) {
  const [metas, setMetas] = useState(tarefa?.metas || []);

  const handleCheckboxChange = async (index) => {
    try {
      // Atualizar o estado localmente
      const updatedMetas = [...metas];
      updatedMetas[index].concluida = !updatedMetas[index].concluida;
      setMetas(updatedMetas);

      // Atualizar no Firebase
      const tarefaRef = doc(db, `empresas/${empresaId}/tarefas`, tarefa.id);
      await updateDoc(tarefaRef, { metas: updatedMetas });
    } catch (error) {
      console.error("Erro ao atualizar meta no Firebase:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.fundo} onPress={handleClose} />
      <View style={styles.content}>
        <Text style={styles.modalTitle}>Detalhes da Tarefa</Text>
        <ScrollView>
          <Text style={styles.sectionTitle}>Objetivo:</Text>
          <Text style={styles.text}>{tarefa?.objetivo || "Não definido"}</Text>

          <Text style={styles.sectionTitle}>Prazo de Finalização:</Text>
          <Text style={styles.text}>{tarefa?.prazoFinalizacao || "Não definido"}</Text>

          <Text style={styles.sectionTitle}>Líder:</Text>
          <Text style={styles.text}>{tarefa?.lider || "Não definido"}</Text>

          <Text style={styles.sectionTitle}>Metas:</Text>
          {metas.map((meta, index) => (
            <View
              key={index}
              style={[
                styles.metaItem,
                meta.concluida ? styles.metaConcluida : styles.metaPendente,
              ]}
            >
              <Checkbox
                status={meta.concluida ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChange(index)}
              />
              <Text
                style={[
                  styles.metaText,
                  meta.concluida && styles.metaTextConcluido,
                ]}
              >
                {meta.descricao}
              </Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="close" size={20} color="#fff" />
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.fundo} onPress={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fundo: {
    width: "100%",
    height: "25%",
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
    width: "90%",
    backgroundColor: "#303030",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#49BF6C",
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: "#fff",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  metaPendente: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
  },
  metaConcluida: {
    backgroundColor: "#49BF6C",
    padding: 10,
    borderRadius: 5,
  },
  metaText: {
    marginLeft: 10,
    color: "#fff",
  },
  metaTextConcluido: {
    textDecorationLine: "line-through",
    color: "#bbb",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d9534f",
    borderRadius: 10,
  },
  closeButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
});