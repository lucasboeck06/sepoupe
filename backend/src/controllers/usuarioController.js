import { criarUsuario } from "../services/usuarioService.js";

export async function criar(request, reply) {
  try {
    const usuario = await criarUsuario(request.body);
    reply.status(201).send(usuario);
  } catch (erro) {
    reply.status(500).send({ erro: erro.message });
  }
}
