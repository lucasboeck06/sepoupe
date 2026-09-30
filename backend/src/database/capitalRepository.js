import { pool } from "./db.js";

export const capitalRepository = {
  async dados() {
    const { rows } = await pool.query(`
            SELECT 
              SUM(saldo) FILTER (WHERE tipo IN('poupanca', 'conta_corrente')) AS patrimonio,
              SUM(saldo) FILTER (WHERE tipo = 'conta_corrente') AS conta,
              SUM(saldo) FILTER (WHERE tipo = 'poupanca') AS poupanca
            FROM public.contas;
        `);

    return rows[0];
  },
};
