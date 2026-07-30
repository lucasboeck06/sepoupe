import {
  inserir,
  listar,
  atualizar,
  deletar,
  consultarPorNome,
} from "../database/categoriaRepository.js";

export async function criarCategoria(nome, tipo) {
  const categoriaExistente = await consultarPorNome(nome);

  if (categoriaExistente) {
    throw new Error("Já existe uma categoria com este nome!s");
  }

  return await inserir(nome, tipo);
}

export async function listarCategorias() {
  // Services mensageiro, passa func direto no return
  return await listar();
}

export async function atualizarCategoria(nome, tipo, id) {
  const categoriaAtualizada = await atualizar(nome, tipo, id);

  if (!categoriaAtualizada) {
    throw new Error("Categoria não existe!");
  }

  return categoriaAtualizada;
}

export async function deletarCategoria(id) {
  const categoriaDeletada = await deletar(id);

  if (!categoriaDeletada) {
    throw new Error("Categoria não existente");
  }

  return categoriaDeletada;
}
