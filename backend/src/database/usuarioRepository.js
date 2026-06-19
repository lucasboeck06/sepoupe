import { pool } from "./db.js";

export async function loginQuery(email) {
  const result = await pool.query(
    "SELECT * FROM public.usuarios WHERE email = $1",
    [email],
  );
  return result.rows[0];
}

export async function criarUsuarioQuery(usuario) {
  const result = await pool.query(
    "INSERT INTO public.usuarios(nome, email, senha) VALUES($1, $2, $3) RETURNING *",
    [usuario.nome, usuario.email, usuario.senha],
  );

  return result.rows;
}
