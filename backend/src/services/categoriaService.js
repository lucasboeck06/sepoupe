import { categoriasQuery } from "../database/categoriaRepository.js";

export async function listarCategorias() {
  const result = await categoriasQuery();
  return result;
}
