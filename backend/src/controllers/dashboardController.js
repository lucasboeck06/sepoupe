import { resumo } from "../services/dashboardService.js";

export async function listar(request, reply) {
  try {
    const { mes } = request.query;

    const dados = await resumo(mes);
    return reply.status(200).send(dados);
  } catch (erro) {
    return reply.status(400).send({ erro: erro.message });
  }
}
