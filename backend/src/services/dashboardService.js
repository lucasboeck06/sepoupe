import { dashboardRepository } from "../database/dashboardRepository.js";

export async function resumo(mes) {
  if (!mes) {
    throw new Error("Mês atual precisa ser enviado!");
  }

  const mesCompleto = `${mes}-01`;

  const resumo = await dashboardRepository.resumo(mesCompleto);

  const contas = await dashboardRepository.contas();

  const top = await dashboardRepository.top(mesCompleto);

  return { resumo, contas, top };
}
