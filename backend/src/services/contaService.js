import { contasRepository } from "../database/contasRepository.js";

export async function registraMovimentacao(operacaoTipo, categoriaNome, valor) {
  const conta = {
    Crédito: "credito",
    Cheque: "cheque",
    VA: "va",
  };

  if (conta[operacaoTipo])
    await contasRepository.adicionarSaldo(conta[operacaoTipo], valor);

  const acerto = {
    "Fatura Inter": "credito",
    "Fatura Caixa": "cheque",
  };

  if (acerto[categoriaNome])
    await contasRepository.reduzirSaldo(acerto[categoriaNome], valor);

  if (categoriaNome === "VA")
    await contasRepository.atualizarLimiteMais("va", valor);
}

export async function reverterMovimentacao(operacaoTipo, categoriaNome, valor) {
  const contas = {
    Crédito: "credito",
    Cheque: "cheque",
    VA: "va",
  };

  if (contas[operacaoTipo])
    await contasRepository.reduzirSaldo(contas[operacaoTipo], valor);

  const acerto = {
    "Fatura Inter": "credito",
    "Fatura Caixa": "cheque",
  };

  if (acerto[categoriaNome])
    await contasRepository.adicionarSaldo(acerto[categoriaNome], valor);

  if (categoriaNome === "VA")
    await contasRepository.atualizarLimiteMenos("va", valor);
}
