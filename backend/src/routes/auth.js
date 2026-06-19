import { logar } from "../controllers/authController.js";

export async function authRoutes(fastify) {
  fastify.post("/auth/login", logar);
}
