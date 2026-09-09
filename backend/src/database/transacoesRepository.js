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

  async listar(id, tipo, ordem, sequencia) {
    if (id) {
      const { rows } = await pool.query(
        `SELECT t.operacao_tipo, c.nome AS categoria_nome, t.valor
         FROM public.transacoes t
         JOIN public.categorias c
          ON t.categoria_id = c.id
         WHERE t.id = $1`,
        [id],
      );

      return rows[0];
    }

    const colunaOrdem = ordem === "criacao" ? "t.criado_em" : "t.data";

    const condicoes = [];
    const valores = [];

    if (tipo) {
      valores.push(tipo);
      condicoes.push(`t.tipo = $${valores.length}`);
    }

    const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";

    const seq = sequencia === "true" ? "DESC" : "ASC";

    const { rows } = await pool.query(
      `SELECT
        t.id,
        t.descricao,
        t.tipo,
        t.valor,
        t.data,
        c.nome AS categoria_nome,
        c.icone,
        c.cor_primaria,
        c.cor_secundaria
      FROM public.transacoes t
      JOIN public.categorias c
        ON t.categoria_id = c.id
      ${where}
      ORDER BY ${colunaOrdem} ${seq}`,
      valores,
    );

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
