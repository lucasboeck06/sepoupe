import { transacaoRepository } from "../database/transacoesRepository.js";

export async function criarTransacao(
  usuarioId,
  descricao,
  categoriaId,
  tipo,
  valor,
  operacaoTipo,
) {
  if (!valor) {
    throw new Error("O valor não pode ser 0, negativo ou inexistente");
  }

  if (!usuarioId || !descricao || !categoriaId || !tipo || !operacaoTipo) {
    throw new Error("Todos os dados são necessários para criar uma transação");
  }

  const transacaoCriada = await transacaoRepository.inserir(
    usuarioId,
    descricao,
    categoriaId,
    tipo,
    valor,
    operacaoTipo,
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
