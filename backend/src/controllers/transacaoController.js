import {
  criarTransacao,
  listarTransacoes,
  deletarTransacao,
} from "../services/transacaoService.js";

export async function criar(request, reply) {
  try {
    const { descricao, categoriaId, valor, operacaoTipo, data } = request.body;

    const usuarioId = request.user.id;

    const novaTransacao = await criarTransacao(
      usuarioId,
      descricao,
      categoriaId,
      valor,
      operacaoTipo,
      data,
    );

    return reply.status(201).send(novaTransacao);
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}

export async function listar(request, reply) {
  try {
    const { tipo, ordem, sequencia, mes } = request.query;

    const lista = await listarTransacoes(tipo, ordem, sequencia, mes);

    return reply.status(200).send(lista);
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}

export async function deletar(request, reply) {
  try {
    const { id } = request.params;

    const transacaoDeletada = await deletarTransacao(id);

    return reply.status(200).send(transacaoDeletada);
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}
