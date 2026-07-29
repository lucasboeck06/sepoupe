import { pool } from "./db.js";

export async function criarCategoriaQuery(nome, tipo) {
  const result = await pool.query(
    "INSERT INTO public.categorias (nome, tipo) VALUES ($1, $2) RETURNING *",
    [nome, tipo],
  );

  return result.rows[0];
}

export async function listaCategoriasQuery() {
  const result = await pool.query("SELECT * FROM public.categorias");
  return result.rows;
}

export async function atualizarCategoriaQuery(nome, tipo, id) {
  const valores = [];
  const campos = [];

  if (nome !== undefined) {
    valores.push(nome);
    campos.push(`nome = $${valores.length}`);
  }

  if (tipo !== undefined) {
    valores.push(tipo);
    campos.push(`tipo = $${valores.length}`);
  }

  if (campos.length === 0) {
    return null;
  }

  valores.push(id);

  // join aqui monta nossa string: "nome = $1, tipo = $2", necessário porque não sabemos quantos dados enviaremos
  // valores.length nos da o tamanho do array, logo, a posição do id, que é o último
  const result = await pool.query(
    `UPDATE public.categorias SET ${campos.join(", ")} WHERE id = $${valores.length} RETURNING *`,
    valores,
  );

  return result.rows[0];
}

export async function deletarCategoriaquery(id) {
  const result = await pool.query(
    `DELETE FROM public.categorias WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
}
