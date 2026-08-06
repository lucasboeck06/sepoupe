import { criar, listar, deletar } from "../controllers/transacaoController.js";

export async function transacoesRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.post("/transacoes", criar);
    instanciaIsolada.get("/transacoes", listar);
    instanciaIsolada.delete("/transacoes", deletar);
  });
}
