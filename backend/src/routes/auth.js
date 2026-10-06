import { deslogar, logar } from "../controllers/authController.js";

export async function authRoutes(fastify) {
  fastify.post(
    "/auth/login",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    logar,
  );
  fastify.post("/auth/logout", deslogar);
}
