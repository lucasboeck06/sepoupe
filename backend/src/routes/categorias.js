import { listar } from "../controllers/categoriaController.js";

export function categoriasRoutes(fastify) {
  fastify.get("/categorias", listar);
}
