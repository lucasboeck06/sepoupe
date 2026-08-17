import { dashboardRepository } from "../database/dashboardRepository.js";

export async function entradasSaidas(mes) {
  if (!mes) {
    throw new Error("Mês atual precisa ser enviado!");
  }

  const mesCompleto = `${mes}-01`;

  const resumo = await dashboardRepository.listar(mesCompleto);

  return resumo;
}
