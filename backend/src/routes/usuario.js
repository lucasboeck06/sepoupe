import { criar } from "../controllers/usuarioController.js";

export async function usuariosRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.post("/usuarios", criar);
  });
}
