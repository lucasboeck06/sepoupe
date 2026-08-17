import { entradasSaidas } from "../services/dashboardService.js";

export async function listar(request, reply) {
  try {
    const { mes } = request.query;

    const resumo = await entradasSaidas(mes);
    return reply.status(200).send(resumo);
  } catch (err) {
    return reply.status(400).send({ err: err.message });
  }
}
