import { pool } from "./db.js";

export const contasRepository = {
  async adicionarSaldo(tipo, saldoGasto) {
    // Como não retorna nada, mete o await e a func logo!
    await pool.query(
      `UPDATE public.contas SET saldo = saldo + $1 WHERE tipo = $2`,
      [saldoGasto, tipo],
    );
  },

  async reduzirSaldo(tipo, saldoGanho) {
    await pool.query(
      `UPDATE public.contas SET saldo = saldo - $1 WHERE tipo = $2`,
      [saldoGanho, tipo],
    );
  },

  async atualizarLimiteMais(tipo, valor) {
    await pool.query(
      `UPDATE public.contas SET limite = limite + $1 WHERE tipo = $2`,
      [valor, tipo],
    );
  },

  async atualizarLimiteMenos(tipo, valor) {},
};
