import { pool } from "./db.js";

export const capitalRepository = {
  async dados() {
    const { rows } = await pool.query(`
            SELECT SUM(saldo) AS patrimonio
            FROM public.contas
            WHERE tipo IN('poupanca', 'conta_corrente');
        `);

    return rows[0];
  },
};
