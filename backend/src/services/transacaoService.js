import { transacaoRepository } from "../database/transacoesRepository.js";
import { categoriaRepository } from "../database/categoriaRepository.js";
import { dashboardRepository } from "../database/dashboardRepository.js";
import { registraMovimentacao, reverterMovimentacao } from "./contaService.js";
import { pool } from "../database/db.js";

export async function criarTransacao(
  usuarioId,
  descricao,
  categoriaId,
  valor,
  operacaoTipo,
  data,
) {
  if (!valor || valor < 0) {
    throw new Error("O valor não pode ser 0, negativo ou inexistente");
  }

  if (!usuarioId || !descricao || !categoriaId || !operacaoTipo || !data) {
    throw new Error("Todos os dados são necessários para criar uma transação");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const categoria = await categoriaRepository.listar(
      categoriaId,
      undefined,
      client,
    );

    if (!categoria) throw new Error("Categoria inexistente na base!");

    const { tipo: categoriaTipo, categoria_nome: categoriaNome } = categoria;

    const transacaoCriada = await transacaoRepository.inserir(
      usuarioId,
      descricao,
      categoriaId,
      categoriaTipo,
      valor,
      operacaoTipo,
      data,
      client,
    );

    await registraMovimentacao(
      operacaoTipo,
      categoriaNome,
      valor,
      categoriaTipo,
      client,
    );

    await client.query("COMMIT");

    return transacaoCriada;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

export async function listarTransacoes(tipo, ordem, sequencia, mes) {
  if (!mes) {
    throw new Error("Mês atual precisa ser enviado!");
  }

  const mesCompleto = `${mes}-01`;

  const transacoes = await transacaoRepository.listar(
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transacao = await transacaoRepository.buscarPorId(id, client);

    if (!transacao) {
      throw new Error("Não existe transação com esse ID!");
    }

    await reverterMovimentacao(
      transacao.operacao_tipo,
      transacao.categoria_nome,
      transacao.valor,
      transacao.tipo,
      client,
    );

    await transacaoRepository.deletar(id, client);

    await client.query("COMMIT");
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}
