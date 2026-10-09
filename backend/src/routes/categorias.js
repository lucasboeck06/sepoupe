import {
  criar,
  listar,
  atualizar,
  deletar,
} from "../controllers/categoriaController.js";

export async function categoriasRoutes(fastify) {
  fastify.register(async function rotasProtegidas(instanciaIsolada) {
    instanciaIsolada.addHook("preHandler", instanciaIsolada.authenticate);

    instanciaIsolada.post("/categorias", criar);
    instanciaIsolada.get("/categorias", listar);
    instanciaIsolada.put("/categorias", atualizar);
    instanciaIsolada.delete("/categorias", deletar);
  });
}
