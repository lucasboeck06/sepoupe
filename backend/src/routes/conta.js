import { investir, resgatar } from "../controllers/contaController.js";

export async function contaRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.post("/contas/investir", investir);
    instanciaIsolada.post("/contas/resgatar", resgatar);
  });
}
