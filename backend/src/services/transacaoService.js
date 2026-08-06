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
