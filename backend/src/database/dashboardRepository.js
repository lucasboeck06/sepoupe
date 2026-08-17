import { pool } from "./db.js";

export const dashboardRepository = {
  async listar(mes) {
    const { rows } = await pool.query(
      // SUM soma todos os valores das linhas selecionadas
      // CASE WHEN é um tipo de if/else dentro da query
      `SELECT
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS saidas FROM public.transacoes
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
};
