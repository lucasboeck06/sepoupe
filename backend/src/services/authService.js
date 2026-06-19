import { loginQuery } from "../database/usuarioRepository.js";
import bcrypt from "bcrypt";

export async function login(email, senha) {
  const usuario = await loginQuery(email);
  if (!usuario) throw new Error("E-mail não encontrado!");

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw new Error("Senha incorreta!");

  return usuario;
}
