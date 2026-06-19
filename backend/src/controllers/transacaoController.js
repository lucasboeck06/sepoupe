import {
  adicionarTransacao,
  listarTransacoes,
} from "../services/transacaoService.js";

export async function listar(request, reply) {
  try {
    const transacoes = await listarTransacoes();
    reply.send(transacoes);
  } catch (err) {
    reply.status(500).send({ erro: err.message });
  }
}

export async function adicionar(request, reply) {
  try {
    const transacoes = await adicionarTransacao(request.body);
    reply.status(201).send(transacoes);
  } catch (err) {
    reply.status(500).send({ erro: err.message });
  }
}
