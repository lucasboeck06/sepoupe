import { usuarioRepository } from "../database/usuarioRepository.js";
import bcrypt from "bcrypt";

export async function login(email, senha) {
  const usuario = await usuarioRepository.loginQuery(email);
  if (!usuario) throw new Error("Credenciais incorretas!");

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw new Error("Credenciais incorretas!");

  return usuario;
}
