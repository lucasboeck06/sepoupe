import { login } from "../services/authService.js";

export async function logar(request, reply) {
  try {
    const usuario = await login(request.body.email, request.body.senha);

    // Isso aqui é um erro comum,  o que permite XSS
    // const token = await reply.jwtSign({ id: usuario.id, email: usuario.email });

    // Precisamos de dois replys, mas não necessariamente eles enviam coisas ao cliente.
    // O primeiro é onde o plugin decorou o método de assinatura, e o segundo é o que faz o envio

    const token = await reply.jwtSign(
      { id: usuario.id, email: usuario.email },
      { expiresIn: "7d" },
    );

    reply
      .setCookie("access_token", token, {
        httpOnly: true,
        secure: true, // Sempre true porque prod e dev usam SSL
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "none", // "none" exige secure:true, obrigatório p/ cross-domain (ngrok)
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .send({ mensagem: "Login realizado com sucesso!" });
  } catch (err) {
    reply.status(401).send({ erro: err.message });
  }
}
