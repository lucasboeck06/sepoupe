import { criar, listar } from "../controllers/usuarioController.js";

export async function usuariosRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.get("/usuarios", listar);
    instanciaIsolada.post("/usuarios", criar);
  });
}
