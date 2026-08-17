import { listar } from "../controllers/dashboardController.js";

export async function dashboardRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.get("/dashboard", listar);
  });
}
