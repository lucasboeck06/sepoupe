import { contaRepository } from "../database/contaRepository.js";
import { pool } from "../database/db.js";

const conta = {
  Crédito: "credito",
  Cheque: "cheque_especial",
  VA: "va",
};

const acerto = {
  "Fatura Inter": "credito",
  "Fatura Caixa": "cheque_especial",
};

const metodosContaCorrente = ["PIX", "Débito", "Dinheiro"];

export async function registrarMovimentacao(
  operacaoTipo,
  categoriaNome,
  valor,
  categoriaTipo,
  client,
) {
  if (conta[operacaoTipo])
    await contaRepository.adicionarSaldo(conta[operacaoTipo], valor, client);

  if (acerto[categoriaNome])
    await contaRepository.reduzirSaldo(acerto[categoriaNome], valor, client);

  if (categoriaNome === "VA")
    await contaRepository.atualizarLimite("va", valor, client);

  if (metodosContaCorrente.includes(operacaoTipo)) {
    if (categoriaTipo === "entrada")
      await contaRepository.adicionarSaldo("conta_corrente", valor, client);

    if (categoriaTipo === "saida" || categoriaTipo === "acerto")
      await contaRepository.reduzirSaldo("conta_corrente", valor, client);
  }
}

export async function reverterMovimentacao(
  operacaoTipo,
  categoriaNome,
  valor,
  categoriaTipo,
  client,
) {
  if (conta[operacaoTipo])
    await contaRepository.reduzirSaldo(conta[operacaoTipo], valor, client);

  if (acerto[categoriaNome])
    await contaRepository.adicionarSaldo(acerto[categoriaNome], valor, client);

  if (categoriaNome === "VA")
    // Ao invés de uma nova func para mandar para o repo, deixamos o valor negativo, isso basta!
    await contaRepository.atualizarLimite("va", -valor, client);

  if (metodosContaCorrente.includes(operacaoTipo)) {
    if (categoriaTipo === "entrada")
      await contaRepository.reduzirSaldo("conta_corrente", valor, client);

    if (categoriaTipo === "saida" || categoriaTipo === "acerto")
      await contaRepository.adicionarSaldo("conta_corrente", valor, client);
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
    const { saldo } = await contaRepository.consultarSaldo(
      "conta_corrente",
      client,
    );

    const saldoContaNumber = Number(saldo);

    if (saldoContaNumber <= 0) throw new Error("Não há saldo para investir");

    if (saldoContaNumber < valorInvestido)
      throw new Error("Valor não disponível!");

    // Executa as duas chamadas
    await contaRepository.reduzirSaldo(
      "conta_corrente",
      valorInvestido,
      client,
    );
    // Falhou aqui? Cai no catch, ele executou o primeiro, opa!
    await contaRepository.adicionarSaldo("poupanca", valorInvestido, client);
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

    const { saldo } = await contaRepository.consultarSaldo("poupanca", client);

    const saldoContaNumber = Number(saldo);

    if (saldoContaNumber <= 0)
      throw new Error("O investimento não tem valor para sacar!");

    if (saldoContaNumber < valorResgatado)
      throw new Error("Valor não disponível!");

    await contaRepository.reduzirSaldo("poupanca", valorResgatado, client);
    await contaRepository.adicionarSaldo(
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
