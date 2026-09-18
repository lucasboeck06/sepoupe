import { contasRepository } from "../database/contasRepository.js";

const conta = {
  Crédito: "credito",
  Cheque: "cheque",
  VA: "va",
};

const acerto = {
  "Fatura Inter": "credito",
  "Fatura Caixa": "cheque",
};

const metodosContaCorrente = ["PIX", "Débito", "Dinheiro"];

export async function registraMovimentacao(
  operacaoTipo,
  categoriaNome,
  valor,
  categoriaTipo,
) {
  if (conta[operacaoTipo])
    await contasRepository.adicionarSaldo(conta[operacaoTipo], valor);

  if (acerto[categoriaNome])
    await contasRepository.reduzirSaldo(acerto[categoriaNome], valor);

  if (categoriaNome === "VA")
    await contasRepository.atualizarLimite("va", valor);

  if (metodosContaCorrente.includes(operacaoTipo)) {
    if (categoriaTipo === "entrada")
      await contasRepository.adicionarSaldo("conta_corrente", valor);

    if (categoriaTipo === "saida")
      await contasRepository.reduzirSaldo("conta_corrente", valor);
  }
}

export async function reverterMovimentacao(
  operacaoTipo,
  categoriaNome,
  valor,
  categoriaTipo,
) {
  if (conta[operacaoTipo])
    await contasRepository.reduzirSaldo(conta[operacaoTipo], valor);

  if (acerto[categoriaNome])
    await contasRepository.adicionarSaldo(acerto[categoriaNome], valor);

  if (categoriaNome === "VA")
    // Ao invés de uma nova func para mandar para o repo, deixamos o valor negativo, isso basta!
    await contasRepository.atualizarLimite("va", -valor);

  if (metodosContaCorrente.includes(operacaoTipo)) {
    if (categoriaTipo === "entrada")
      await contasRepository.reduzirSaldo("conta_corrente", valor);

    if (categoriaTipo === "saida")
      await contasRepository.adicionarSaldo("conta_corrente", valor);
  }
}
