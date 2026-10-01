import { dados } from "../controllers/capitalController.js";

export async function capitalRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.get("/capital", dados);
  });
}
