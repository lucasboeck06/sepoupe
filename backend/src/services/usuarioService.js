import {
  loginQuery,
  criarUsuarioQuery,
} from "../database/usuarioRepository.js";
import bcrypt from "bcrypt";

export async function listarUsuarios() {
  const result = await loginQuery();
  return result;
}

export async function criarUsuario(usuario) {
  usuario.senha = await bcrypt.hash(usuario.senha, 10);

  const result = await criarUsuarioQuery(usuario);
  return result;
}
