import { pool } from "./db.js";

export const dashboardRepository = {
  async resumo(mes) {
    const { rows } = await pool.query(
      // SUM soma todos os valores das linhas selecionadas
      // CASE WHEN é um tipo de if/else dentro da query
      `SELECT
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saidas,
        SUM(CASE WHEN tipo = 'acerto' THEN valor ELSE 0 END) AS acertos FROM public.transacoes
        WHERE data >= $1::date
            ANd data < $1:: date + INTERVAL '1 month'`,
      [mes],
    );

    return {
      // Retorna os objetos entradas e saídas, com o valor transformado para número, ou zero se for null.
      entradas: Number(rows[0].entradas || 0),
      saidas: Number(rows[0].saidas || 0),
    };
  },

  async contas() {
    const { rows } = await pool.query(
      `SELECT id, nome, tipo, limite::float, saldo::float FROM public.contas`,
    );

    return rows;
  },

  async top(mes) {
    const { rows } = await pool.query(
      `
        SELECT
            c.id AS categoria_id,
            c.nome,
            c.icone,
            c.cor_primaria,
            c.cor_secundaria,
            SUM(t.valor)::float AS total_gasto
        FROM public.transacoes t
        JOIN public.categorias c ON t.categoria_id = c.id
        WHERE t.data >= $1::date
            AND t.data < $1:: date + INTERVAL '1 month'
            AND t.tipo = 'saida'
        GROUP BY c.id
        ORDER BY total_gasto DESC
        LIMIT 10
    `,
      [mes],
    );

    return rows;
  },
};
