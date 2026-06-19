import { listar } from "../controllers/categoriaController.js";

export async function categoriasRoutes(fastify) {
  fastify.get("/categorias", listar);
}
