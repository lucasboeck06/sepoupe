import { login } from "../services/authService.js";

export async function logar(request, reply) {
  try {
    const usuario = await login(request.body.email, request.body.senha);

    // Isso aqui é um erro comum,  o que permite XSS
    // const token = await reply.jwtSign({ id: usuario.id, email: usuario.email });

    // Precisamos de dois replys, mas não necessariamente eles enviam coisas ao cliente.
    // O primeiro é onde o plugin decorou o método de assinatura, e o segundo é o que faz o envio

    const token = await reply.jwtSign({ id: usuario.id, email: usuario.email });

    reply
      .setCookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Quando na env for "production", será true
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" exige secure:true, obrigatório p/ cross-domain (ngrok)
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .send({ mensagem: "Login realizado com sucesso!" });
  } catch (err) {
    reply.status(401).send({ erro: err.message });
  }
}
