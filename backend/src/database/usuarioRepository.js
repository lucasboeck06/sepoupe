import { pool } from "./db.js";

export const usuarioRepository = {
  async loginQuery(email) {
    const result = await pool.query(
      "SELECT id, nome, email, senha FROM public.usuarios WHERE email = $1",
      [email],
    );
    return result.rows[0];
  },

  async criarUsuarioQuery(usuario) {
    const result = await pool.query(
      "INSERT INTO public.usuarios(nome, email, senha) VALUES($1, $2, $3) RETURNING id, nome, email",
      [usuario.nome, usuario.email, usuario.senha],
    );

    return result.rows;
  },
};
