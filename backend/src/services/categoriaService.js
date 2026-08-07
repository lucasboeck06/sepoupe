import { categoriaRepository } from "../database/categoriaRepository.js";

export async function criarCategoria(nome, tipo) {
  if (!nome || !tipo) {
    throw new Error("O nome e o tipo são necessários!");
  }

  const categoriaExistente = await categoriaRepository.listar(nome);

  if (categoriaExistente[0]) {
    throw new Error("Já existe uma categoria com este nome!");
  }

  return await categoriaRepository.inserir(nome, tipo);
}

export async function listarCategorias(nome) {
  const nomeLimpo = nome ? nome.trim() : undefined;

  // Services mensageiro, passa func direto no return
  return await categoriaRepository.listar(nomeLimpo);
}

export async function atualizarCategoria(nome, tipo, id) {
  if (!id) {
    throw new Error("o IDé necessário para atualizar a categoria!");
  }

  if (!nome && !tipo) {
    throw new Error("É necessário nome ou tipo para atualizar a categoria!");
  }

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
  if (!id) {
    throw new Error("É necessário o ID para deletar uma categoria!");
  }

  const categoriaDeletada = await categoriaRepository.deletar(id);

  if (!categoriaDeletada) {
    throw new Error("Categoria não existente!");
  }

  return categoriaDeletada;
}
