import { categoriaRepository } from "../database/categoriaRepository.js";

export async function criarCategoria(nome, tipo) {
  if (!nome || !tipo) {
    throw new Error("O nome e o tipo são necessários!");
  }

  // Precisa de um undefined se não cai nome no id do Repo
  const categoriaExistente = await categoriaRepository.listar(undefined, nome);

  if (categoriaExistente) {
    throw new Error("Já existe uma categoria com este nome!");
  }

  // Normaliza o tipo, sem acentos e completamente minúsculo, o banco só aceita assim!
  // entrada || saida
  tipo = tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return await categoriaRepository.inserir(nome, tipo);
}

export async function listarCategorias() {
  // Services mensageiro, passa func direto no return
  return await categoriaRepository.listar();
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
