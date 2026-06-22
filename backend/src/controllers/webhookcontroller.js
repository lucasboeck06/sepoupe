import { criarTransacao } from "../services/webhookService.js";

export async function logHook(request, reply) {
  try {
    const token = request.headers["asaas-access-token"];
    if (token !== process.env.WEBHOOK_TOKEN_ASAAS) {
      return reply.status(401).send({ erro: "Token inválido" });
    }

    const transacao = await criarTransacao(request.body);
    reply.status(201).send(transacao);
  } catch (err) {
    reply.status(500).send({ erro: err.message });
  }
}
