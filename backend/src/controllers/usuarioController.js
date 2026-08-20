import { criarUsuario, listarUsuarios } from "../services/usuarioService.js";

export async function criar(request, reply) {
  try {
    const usuario = await criarUsuario(request.body);
    reply.status(201).send(usuario);
  } catch (err) {
    reply.status(500).send({ erro: err.message });
  }
}
