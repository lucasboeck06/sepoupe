import { pool } from "./db.js";

export const categoriaRepository = {
  async inserir(nome, tipo) {
    const { rows } = await pool.query(
      "INSERT INTO public.categorias (nome, tipo) VALUES ($1, $2) RETURNING *",
      [nome, tipo],
    );

    return rows[0];
  },

  async listar() {
    const { rows } = await pool.query("SELECT * FROM public.categorias");
    return rows;
  },

  async consultarPorNome(nome) {
    const { rows } = await pool.query(
      `SELECT * FROM public.categorias WHERE nome = $1`,
      [nome],
    );

    return rows[0];
  },

  async atualizar(nome, tipo, id) {
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
    const { rows } = await pool.query(
      `UPDATE public.categorias SET ${campos.join(", ")} WHERE id = $${valores.length} RETURNING *`,
      valores,
    );

    return rows[0];
  },

  async deletar(id) {
    const { rows } = await pool.query(
      `DELETE FROM public.categorias WHERE id = $1 RETURNING *`,
      [id],
    );

    return rows[0];
  },
};
