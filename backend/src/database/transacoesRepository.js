import { pool } from "./db.js";

export async function transacoesQuery() {
  const result = await pool.query("SELECT * FROM public.transacoes");
  return result.rows;
}

export async function transacoesQueryAdd(transacao) {
  const result = await pool.query(
    "INSERT INTO public.transacoes(usuario_id, descricao, categoria_id, tipo, valor) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      transacao.usuario_id,
      transacao.descricao,
      transacao.categoria_id,
      transacao.tipo,
      transacao.valor,
    ],
  );

  return result.rows;
}

export async function transacoesSemInfoQuery() {
  const result = await pool.query(
    "SELECT * FROM public.transacoes WHERE categoria_id IS NULL",
  );

  return result.rows;
}
