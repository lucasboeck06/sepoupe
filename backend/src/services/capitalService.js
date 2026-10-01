import { capitalRepository } from "../database/capitalRepository.js";

export async function getDados() {
  const dados = await capitalRepository.dados();

  return {
    patrimonio: Number(dados.patrimonio ?? 0),
    conta: Number(dados.conta ?? 0),
    poupanca: Number(dados.poupanca ?? 0),
  };
}
