import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const loginUsuario = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user; // Retorna o usuário logado
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const verificarUsuarioLogado = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user); // Chama a função de callback com o estado do usuário
  });
};
