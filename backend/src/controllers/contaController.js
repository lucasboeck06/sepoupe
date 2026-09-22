import {
  registrarInvestimento,
  registrarResgate,
} from "../services/contaService.js";

export async function investir(request, reply) {
  try {
    // Já que é um POST, pegamos os dados no body
    const { valor } = request.body;

    await registrarInvestimento(valor);

    // Fastify precisa de um send, mesmo que vazio
    return reply.status(200).send();
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}

export async function resgatar(request, reply) {
  try {
    const { valor } = request.body;

    await registrarResgate(valor);

    return reply.status(200).send();
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}
