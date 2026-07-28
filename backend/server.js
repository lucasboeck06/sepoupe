import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { categoriasRoutes } from "./src/routes/categorias.js";
import { usuariosRoutes } from "./src/routes/usuarios.js";
import { transacoesRoutes } from "./src/routes/transacoes.js";
import { authRoutes } from "./src/routes/auth.js";
import { webhookRoutes } from "./src/routes/webhook.js";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

//Define o método como GET
//async aqui porque, algum dia vai consultar um banco e precisar de um await para a resposta
// fastify.get("/", async (request, reply) => {
//request é o que é enviado para o server, o que chega. Dados da requisição. (body, params, headers, query)

//reply é a resposta do servidor para quem solicitou. Interface... (send, status, header)
// reply.send({ hello: "world" });
//   return { hello: "world" };
// });

fastify.register(fastifyJwt, { secret: process.env.SECRET });

fastify.register(categoriasRoutes);
fastify.register(usuariosRoutes);
fastify.register(transacoesRoutes);
fastify.register(authRoutes);

fastify.register(fastifyCors, {
  origin: "*", // Libera tudo por enquanto, em produção restringe
});

// fastify.listen({ port: 3000 }, function (err, address) {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// });

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ erro: "Token inválido ou ausente" });
  }
});

const start = async () => {
  try {
    //async/await aqui porquer precisamos fazer o bind (associar o IP e a porta da máquina)
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
