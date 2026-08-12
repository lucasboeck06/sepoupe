import { pool } from "./db.js";

export const transacaoRepository = {
  async inserir(
    usuarioId,
    descricao,
    categoriaId,
    categoriaTipo,
    valor,
    operacaoTipo,
    data,
  ) {
    const { rows } = await pool.query(
      "INSERT INTO public.transacoes (usuario_id, descricao, categoria_id, tipo, valor, operacao_tipo, data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        usuarioId,
        descricao,
        categoriaId,
        categoriaTipo,
        valor,
        operacaoTipo,
        data,
      ],
    );

    return rows[0];
  },

  async listar(tipo) {
    if (tipo) {
      const { rows } = await pool.query(
        "SELECT * FROM public.transacoes WHERE tipo = $1",
        [tipo],
      );

      return rows;
    }

    const { rows } = await pool.query("SELECT * FROM public.transacoes");

    return rows;
  },

  async deletar(id) {
    const { rows } = await pool.query(
      "DELETE FROM public.transacoes WHERE id = $1 RETURNING *",
      [id],
    );

    return rows[0];
  },
};
