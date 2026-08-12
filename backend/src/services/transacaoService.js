import { transacaoRepository } from "../database/transacoesRepository.js";
import { categoriaRepository } from "../database/categoriaRepository.js";

export async function criarTransacao(
  usuarioId,
  descricao,
  categoriaId,
  valor,
  operacaoTipo,
  data,
) {
  if (!valor) {
    throw new Error("O valor não pode ser 0, negativo ou inexistente");
  }

  if (!usuarioId || !descricao || !categoriaId || !operacaoTipo || !data) {
    throw new Error("Todos os dados são necessários para criar uma transação");
  }

  // Desestruturo o tipo e atribuo o nome que eu quero
  const { tipo: categoriaTipo } = await categoriaRepository.listar(categoriaId);

  const transacaoCriada = await transacaoRepository.inserir(
    usuarioId,
    descricao,
    categoriaId,
    categoriaTipo,
    valor,
    operacaoTipo,
    data,
  );

  return transacaoCriada;
}

export async function listarTransacoes(tipo) {
  return transacaoRepository.listar(tipo);
}

export async function deletarTransacao(id) {
  if (!id) {
    throw new Error("É necessário o ID para identificar a transação!");
  }

  const transacaoDeletada = await transacaoRepository.deletar(id);

  if (!transacaoDeletada) {
    throw new Error("Não existe transação com esse ID!");
  }

  return transacaoDeletada;
}
