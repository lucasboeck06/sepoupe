import {
  criarCategoria,
  listarCategorias,
  atualizarCategoria,
  deletarCategoria,
} from "../services/categoriaService.js";

export async function criar(request, reply) {
  try {
    const { nome, tipo } = request.body;

    if (!nome || !tipo) {
      return reply.status(400).send({ erro: "Os campos são obrigatóios" });
    }

    const novaCategoria = await criarCategoria(nome, tipo);

    return reply.status(201).send(novaCategoria);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}

export async function listar(request, reply) {
  try {
    const categorias = await listarCategorias();
    reply.send(categorias);
  } catch (err) {
    return reply.status(500).send({ erro: err.message });
  }
}
