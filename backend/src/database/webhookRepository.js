import { pool } from "./db.js";

export async function queryConsultaAsaasId(id) {
  const result = await pool.query(
    "SELECT id FROM public.usuarios WHERE asaas_account_id = $1",
    [id],
  );

  return result.rows[0]?.id;
}

export async function queryConsultaCategoria(destinatario) {
  const result = await pool.query(
    "SELECT id FROM public.categorias WHERE nome = $1",
    [destinatario],
  );

  return result.rows[0]?.id;
}

export async function queryPayloadAsaas(transacao) {
  const result = await pool.query(
    "INSERT INTO public.transacoes(usuario_id, descricao, categoria_id, tipo, valor, criado_em, operacao_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      transacao.usuario_id,
      transacao.descricao,
      transacao.categoria_id,
      transacao.tipo,
      transacao.valor,
      transacao.dataHora,
      transacao.operacao_tipo,
    ],
  );

  return result.rows[0];
}
