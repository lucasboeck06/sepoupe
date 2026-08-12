import {
  criarCategoria,
  listarCategorias,
  atualizarCategoria,
  deletarCategoria,
} from "../services/categoriaService.js";

export async function criar(request, reply) {
  try {
    const { nome, tipo } = request.body;

    const novaCategoria = await criarCategoria(nome, tipo);

    return reply.status(201).send(novaCategoria);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}

export async function listar(request, reply) {
  try {
    const { nome } = request.query;

    const categorias = await listarCategorias(nome);
    reply.status(200).send(categorias);
  } catch (err) {
    return reply.status(500).send({ erro: err.message });
  }
}

export async function atualizar(request, reply) {
  try {
    const { nome, tipo, id } = request.body;

    const categoriaAtualizada = await atualizarCategoria(nome, tipo, id);

    return reply.status(200).send(categoriaAtualizada);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}

export async function deletar(request, reply) {
  try {
    const { id } = request.body;

    const categoriaDeletada = await deletarCategoria(id);

    return reply.status(200).send(categoriaDeletada);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}
