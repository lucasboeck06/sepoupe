import {
  transacoesQuery,
  transacoesQueryAdd,
} from "../database/transacoesRepository.js";

export async function listarTransacoes() {
  const result = await transacoesQuery();
  return result;
}

export async function adicionarTransacao(transacao) {
  const result = await transacoesQueryAdd(transacao);
  return result;
}
