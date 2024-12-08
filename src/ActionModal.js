import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, CheckBox } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export function ActionModal({ handleClose, tarefa, }) {


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
                                        <CheckBox
                                            style={styles.input}
                                        />
                                        <Text style={styles.label}>Tarefa</Text>
                                    </View>
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            style={styles.input}
                                        />
                                        <Text style={styles.label}>Tarefa</Text>
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
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "56%",
        padding: 10,
        flexWrap: "wrap",
    },
    content: {
        width: "100%",
        height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "#131A2F",
        borderRadius: 20,
        borderWidth:1,
        borderColor:"#fff",
        flexWrap: "wrap"
    },
    modalTitle: {
        fontSize: 12,
        fontWeight: "thin",
        marginBottom: 10,
        color: "#fff",
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
    tarefaDescricao: {
        fontSize: 16,
        color: "#fff",
    },
    tarefalider: {
        fontSize: 16,
        marginBottom: 5,
        color: "#fff",
        marginBottom: 10,
    },
    tarefalider: {
        fontSize: 16,
        marginBottom: 5,
        color: "#fff",
        marginBottom: 10,
    },
    tarefacolaborador: {
        fontSize: 16,
        marginBottom: 5,
        color: "#fff",
        marginBottom: 10,
    },
    metas: {
        display: "flex",
        height: "auto",
        width: "100%",
        backgroundColor: "#131A2F",
        flexDirection: "column",
        padding:5,
        flexWrap: "wrap",
    },
    titulometas: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffF",
        marginBottom: 20,
    },
    checkboxContainer: {
        width: "auto%",
        height: "auto",
        justifyContent: "center",
        alignItems:"center",
        flexDirection: "row",
        margin: 5,
    },
    label: {
        fontSize: 15,
        fontWeight: "thin",
        color: "#fff",
    },
    metas2: {
        display: "flex",
        width: "100%",
        height: "auto",
        flexDirection: "row",
        padding: 3,
    },
    input:{
        alignSelf: 'center',
        marginRight:5,
    },
});
