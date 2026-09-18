import { transacaoRepository } from "../database/transacoesRepository.js";
import { categoriaRepository } from "../database/categoriaRepository.js";
import { dashboardRepository } from "../database/dashboardRepository.js";
import { registraMovimentacao, reverterMovimentacao } from "./contaService.js";

export async function criarTransacao(
  usuarioId,
  descricao,
  categoriaId,
  categoriaNome,
  valor,
  operacaoTipo,
  data,
) {
  if (!valor || valor < 0) {
    throw new Error("O valor não pode ser 0, negativo ou inexistente");
  }

  if (
    !usuarioId ||
    !descricao ||
    !categoriaId ||
    !categoriaNome ||
    !operacaoTipo ||
    !data
  ) {
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

  await registraMovimentacao(operacaoTipo, categoriaNome, valor, categoriaTipo);

  return transacaoCriada;
}

export async function listarTransacoes(tipo, ordem, sequencia, mes) {
  if (!mes) {
    throw new Error("Mês atual precisa ser enviado!");
  }

  const mesCompleto = `${mes}-01`;

  const transacoes = await transacaoRepository.listar(
    undefined,
    tipo,
    ordem,
    sequencia,
    mes,
  );

  const resumo = await dashboardRepository.resumo(mesCompleto);

  return { transacoes, resumo };
}

export async function deletarTransacao(id) {
  if (!id) {
    throw new Error("É necessário o ID para identificar a transação!");
  }

  const transacao = await transacaoRepository.listar(id, undefined);

  if (!transacao) {
    throw new Error("Não existe transação com esse ID!");
  }

  await reverterMovimentacao(
    transacao.operacao_tipo,
    transacao.categoria_nome,
    transacao.valor,
  );

  await transacaoRepository.deletar(id);
}
