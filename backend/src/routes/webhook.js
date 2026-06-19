import { logHook } from "../controllers/webhookcontroller.js";

export async function webhookRoutes(fastify) {
  fastify.post("/webhook/asaas", logHook);
}
