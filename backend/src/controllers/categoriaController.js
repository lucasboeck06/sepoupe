import { listarCategorias } from "../services/categoriaService.js";

export async function listar(request, reply) {
  try {
    const categorias = await listarCategorias();
    reply.send(categorias);
  } catch (err) {
    return reply.status(500).send({ erro: err.message });
  }
}
