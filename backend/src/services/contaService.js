import { contasRepository } from "../database/contasRepository.js";
import { pool } from "../database/db.js";

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

export async function registrarInvestimento(valorInvestido) {
  if (!valorInvestido || valorInvestido <= 0) {
    throw new Error(
      "É necessário um valor para investir, e que seja maior que zero!",
    );
  }

  // Abre uma conexão com o banco (tem um limite, por isso ela finally, acaba)
  const client = await pool.connect();

  // Por que usar try/catch? O que é isso?
  // BEGIN/COMMIT/ROLLBACK serve para que, ou tudo seja feito ou nada! Garantindo a atomicidade dos dados
  // O banco pode cair, o cliente pode perder sinal, e se isso ocorrer bem no meio de uma operação, uma das chamadas pode ser realizada e a outra não, e isso é inadimissível!
  try {
    // Começa o bloco
    await client.query("BEGIN");
    // Executa as duas chamadas
    await contasRepository.reduzirSaldo(
      "conta_corrente",
      valorInvestido,
      client,
    );
    // Falhou aqui? Cai no catch, ele executou o primeiro, opa!
    await contasRepository.adicionarSaldo("poupanca", valorInvestido, client);
    // Finaliza como uma coisa só!
    await client.query("COMMIT");
  } catch (erro) {
    // Aqui a gente reverte a ação, caso haja qualquer erro, mitigando a passagem de uma única chamada
    await client.query("ROLLBACK");
    throw erro;
    // Finaliza a conexão que foi aberta
  } finally {
    client.release();
  }
}

export async function registrarResgate(valorResgatado) {
  if (!valorResgatado || valorResgatado <= 0) {
    throw new Error(
      "É necessário um valor para resgatar, e que seja maior que zero!",
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await contasRepository.reduzirSaldo("poupanca", valorResgatado, client);
    await contasRepository.adicionarSaldo(
      "conta_corrente",
      valorResgatado,
      client,
    );
    await client.query("COMMIT");
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}
