import {
  criarTransacao,
  listarTransacoes,
  deletarTransacao,
} from "../services/transacaoService.js";

export async function criar(request, reply) {
  try {
    const { usuarioId, descricao, categoriaId, tipo, valor, operacaoTipo } =
      request.body;

    const novaTransacao = await criarTransacao(
      usuarioId,
      descricao,
      categoriaId,
      tipo,
      valor,
      operacaoTipo,
    );

    return reply.status(201).send(novaTransacao);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}

export async function listar(request, reply) {
  try {
    const { tipo } = request.body;

    const lista = await listarTransacoes(tipo);

    return reply.status(200).send(lista);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}

export async function deletar(request, reply) {
  try {
    const { id } = request.body;

    const transacaoDeletada = await deletarTransacao(id);

    return reply.status(200).send(transacaoDeletada);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}
