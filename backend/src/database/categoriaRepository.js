import { pool } from "./db.js";

export async function categoriasQuery() {
  const result = await pool.query("SELECT * FROM public.categorias");
  return result.rows;
}
