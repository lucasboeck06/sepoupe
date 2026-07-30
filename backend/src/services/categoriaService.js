import { categoriaRepository } from "../database/categoriaRepository.js";

export async function criarCategoria(nome, tipo) {
  const categoriaExistente = await categoriaRepository.consultarPorNome(nome);

  if (categoriaExistente) {
    throw new Error("Já existe uma categoria com este nome!");
  }

  return await categoriaRepository.inserir(nome, tipo);
}

export async function listarCategorias() {
  // Services mensageiro, passa func direto no return
  return await categoriaRepository.listar();
}

export async function atualizarCategoria(nome, tipo, id) {
  const categoriaAtualizada = await categoriaRepository.atualizar(
    nome,
    tipo,
    id,
  );

  if (!categoriaAtualizada) {
    throw new Error("Categoria não existe!");
  }

  return categoriaAtualizada;
}

export async function deletarCategoria(id) {
  const categoriaDeletada = await categoriaRepository.deletar(id);

  if (!categoriaDeletada) {
    throw new Error("Categoria não existente");
  }

  return categoriaDeletada;
}
