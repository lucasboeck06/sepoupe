import { loginQuery } from "../database/usuarioRepository.js";
import bcrypt from "bcrypt";

export async function login(email, senha) {
  const usuario = await loginQuery(email);
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!usuario || !senhaValida) throw new Error("Credenciais incorretas!");

  return usuario;
}
