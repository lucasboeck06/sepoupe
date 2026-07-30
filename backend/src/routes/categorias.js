import {
  criar,
  listar,
  atualizar,
  deletar,
} from "../controllers/categoriaController.js";

export async function categoriasRoutes(fastify) {
  // Se você tivesse uma rota pública (ex: listar categorias para visitantes verem),
  // ela ficaria solta aqui fora, sem proteção.
  // fastify.get('/categorias/publicas', listar);

  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", verificarToken);

    instanciaIsolada.post("/categorias", criar);
    instanciaIsolada.get("/categorias", listar);
    instanciaIsolada.put("/categorias", atualizar);
    instanciaIsolada.delete("/categorias", deletar);
  });
}
