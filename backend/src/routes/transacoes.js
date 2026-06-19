import { adicionar, listar } from "../controllers/transacaoController.js";

export async function transacoesRoutes(fastify) {
  fastify.get("/transacoes", { preHandler: fastify.authenticate }, listar);
  fastify.post("/transacoes", adicionar);
}
