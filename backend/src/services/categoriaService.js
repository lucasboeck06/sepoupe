import {
  criaCategoriaQuery,
  listaCategoriasQuery,
  atualizaCategoriaQuery,
  deletaCategoriaQuery,
} from "../database/categoriaRepository.js";

export async function criaCategoria(nome, tipo) {
  const result = await criaCategoriaQuery(nome, tipo);

  return result;
}

export async function listarCategorias() {
  const result = await listaCategoriasQuery();
  return result;
}

export async function atualizaCategoria(nome, tipo, id) {
  const result = await atualizaCategoriaQuery(nome, tipo, id);

  return result;
}

export async function deletaCategoria(id) {
  const result = deletaCategoriaQuery(id);

  return result;
}
