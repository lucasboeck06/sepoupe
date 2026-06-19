import { login } from "../services/authService.js";

export async function logar(request, reply) {
  try {
    const usuario = await login(request.body.email, request.body.senha);

    const token = await reply.jwtSign({ id: usuario.id, email: usuario.email });

    reply.send({ token });
  } catch (err) {
    reply.status(401).send({ erro: err.message });
  }
}
