import {
  queryConsultaAsaasId,
  queryConsultaCategoria,
  queryPayloadAsaas,
} from "../database/webhookRepository.js";

export async function criarTransacao(payload) {
  const usuarioId = await queryConsultaAsaasId(payload.account.id);

  const categoriaId = await queryConsultaCategoria(
    payload.transfer.bankAccount.ownerName,
  );

  const transacao = {
    usuario_id: usuarioId,
    descricao: payload.transfer.bankAccount.ownerName,
    categoria_id: categoriaId,
    tipo: "saida",
    valor: payload.transfer.value,
    dataHora: payload.dateCreated,
    operacao_tipo: payload.transfer.operationType,
  };

  const result = await queryPayloadAsaas(transacao);
  return result;
}
