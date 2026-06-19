import { criar, listar } from "../controllers/usuarioController.js";

export async function usuariosRoutes(fastify) {
  fastify.get("/usuarios", listar);
  fastify.post("/usuarios", criar);
}
