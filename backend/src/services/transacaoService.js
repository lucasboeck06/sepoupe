import {
  transacoesQuery,
  transacoesQueryAdd,
  transacoesSemInfoQuery,
} from "../database/transacoesRepository.js";

export async function listarTransacoes() {
  const result = await transacoesQuery();
  return result;
}

export async function adicionarTransacao(transacao) {
  const result = await transacoesQueryAdd(transacao);
  return result;
}

export async function transacoesSemCategoria() {
  const result = await transacoesSemInfoQuery();
  return result;
}
