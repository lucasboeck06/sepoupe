import {
  criaCategoriaQuery,
  listaCategoriasQuery,
  atualizaCategoriaQuery,
  deletaCategoriaQuery,
} from "../database/categoriaRepository.js";

export async function criaCategoria(nome, tipo) {
  const categoriaExistente = await consultaCategoriaPorNome(nome);

  if (categoriaExistente) {
    throw new Error("Já existe uma categoria com este nome!s");
  }

  return await criaCategoriaQuery(nome, tipo);
}

export async function listarCategorias() {
  // Services mensageiro, passa func direto no return
  return await listaCategoriasQuery();
}

export async function atualizaCategoria(nome, tipo, id) {
  const categoriaAtualizada = await atualizaCategoriaQuery(nome, tipo, id);

  if (!categoriaAtualizada) {
    throw new Error("Categoria não existe!");
  }

  return categoriaAtualizada;
}

export async function deletaCategoria(id) {
  const categoriaDeletada = await deletaCategoriaQuery(id);

  if (!categoriaDeletada) {
    throw new Error("Categoria não existente");
  }

  return categoriaDeletada;
}
