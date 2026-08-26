import { transacaoRepository } from "../database/transacoesRepository.js";
import { categoriaRepository } from "../database/categoriaRepository.js";
import { contasRepository } from "../database/contasRepository.js";

export async function criarTransacao(
  usuarioId,
  descricao,
  categoriaId,
  valor,
  operacaoTipo,
  data,
) {
  if (!valor || valor < 0) {
    throw new Error("O valor não pode ser 0, negativo ou inexistente");
  }

  if (!usuarioId || !descricao || !categoriaId || !operacaoTipo || !data) {
    throw new Error("Todos os dados são necessários para criar uma transação");
  }

  // Desestruturo o tipo e atribuo o nome que eu quero
  const { tipo: categoriaTipo } = await categoriaRepository.listar(categoriaId);

  const transacaoCriada = await transacaoRepository.inserir(
    usuarioId,
    descricao,
    categoriaId,
    categoriaTipo,
    valor,
    operacaoTipo,
    data,
  );

  const TIPOS_CONTA = {
    Crédito: "credito",
    Cheque: "cheque_especial",
    VA: "va",
  };

  const tipoConta = TIPOS_CONTA[operacaoTipo];
  if (tipoConta) {
    await contasRepository.adicionarSaldo(TIPOS_CONTA[operacaoTipo], valor);
  }

  const ACERTOS = {
    37: "credito",
    45: "chqeque",
  };

  if (ACERTOS[categoriaId]) {
    await contasRepository.reduzirSaldo(ACERTOS[categoriaId], valor);
  }

  // Só para garantir que a comparação é Number com Number!
  if (Number(categoriaId) === 12) {
    await contasRepository.atualizarLimite("va", valor);
  }

  return transacaoCriada;
}

export async function listarTransacoes(tipo) {
  return transacaoRepository.listar(tipo);
}

export async function deletarTransacao(id) {
  if (!id) {
    throw new Error("É necessário o ID para identificar a transação!");
  }

  const transacaoDeletada = await transacaoRepository.deletar(id);

  if (!transacaoDeletada) {
    throw new Error("Não existe transação com esse ID!");
  }

  return transacaoDeletada;
}
