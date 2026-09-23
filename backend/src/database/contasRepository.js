import { pool } from "./db.js";

export const contasRepository = {
  // Condição no parametro, se client for undefined, ele usa pool!
  async adicionarSaldo(tipo, saldo, client = pool) {
    // Como não retorna nada, mete o await e a func logo!
    await client.query(
      `UPDATE public.contas SET saldo = saldo + $1 WHERE tipo = $2`,
      [saldo, tipo],
    );
  },

  async reduzirSaldo(tipo, saldo, client = pool) {
    await client.query(
      `UPDATE public.contas SET saldo = saldo - $1 WHERE tipo = $2`,
      [saldo, tipo],
    );
  },

  async atualizarLimite(tipo, valor) {
    await pool.query(
      // Se $1 for negativo, é executado uma subtração!
      `UPDATE public.contas SET limite = limite + $1 WHERE tipo = $2`,
      [valor, tipo],
    );
  },
};
