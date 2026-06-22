import {
  queryConsultaAsaasId,
  queryConsultaCategoria,
  queryPayloadAsaas,
} from "../database/webhookRepository.js";

export async function criarTransacao(payload) {
  const usuarioId = await queryConsultaAsaasId(payload.account.id);

  const categoria = await queryConsultaCategoria(
    payload.transfer.bankAccount.ownerName,
  );

  const infoReconhecidas = !!(usuarioId && categoria); // Regra verdade, somente truthy se os dois corresponderem

  const transacao = {
    usuario_id: usuarioId,
    descricao: categoria?.nome || null, // Puxa o nome da categoria, se for undefined, vira null
    categoria_id: categoria?.id || null,
    tipo: "saida",
    valor: payload.transfer.value,
    dataHora: payload.dateCreated,
    info_reconhecidas: infoReconhecidas,
    operacao_tipo: payload.transfer.operationType,
  };

  const result = await queryPayloadAsaas(transacao);
  return result;
}
