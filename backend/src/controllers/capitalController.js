import { dados, dados } from "../services/capitalService.js";

export async function dados(request, reply) {
  try {
    const dados = await dados();
    return reply.status(200).send(dados);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}
