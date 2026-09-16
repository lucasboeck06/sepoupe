import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import GraficoGastosScroll from "../components/GraficoGastosScroll.jsx";
import { DynamicIcon } from "lucide-react/dynamic";
import { CreditCard } from "lucide-react";
import SelectMes from "../components/SelectMes.jsx";
import CircularProgress from "../components/CircularProgress.jsx";

export default function Dashboard() {
  const [dados, setDados] = useState([]);

  const saudacao = () => {
    // Função para pegar a hora atual
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia, ";
    if (hora < 18) return "Boa tarde, ";
    return "Boa noite, ";
  };

  const usuarioNomeCompleto = localStorage.getItem("nome-usuario");
  const usuarioPrimeiroNome = usuarioNomeCompleto.split(" ")[0];

  const mesAtual = new Date().toISOString().slice(0, 7);

  const [filtro, setFiltro] = useState({
    mes: mesAtual,
  });

  async function buscarDados() {
    const resposta = await fetch(
      `
        ${import.meta.env.VITE_API_BASE_URL}/dashboard?mes=${filtro.mes}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      },
    );

    if (resposta.status === 401) {
      localStorage.removeItem("usuario-logado"); // Limpa o "crachá"
      window.location.href = "/"; // Joga na tela de login à força
      return; // Para tudo e não deixa tentar ler o json
    }

    const result = await resposta.json();
    setDados(result);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono, setState roda fora do render síncrono
    buscarDados();
  }, [filtro]);

  function onMudarMes(novoMes) {
    setFiltro((atual) => ({ ...atual, mes: novoMes }));
  }

  // Se dados.resumo? form undefined ou null, para aqui e retorna undefined
  // Sem tentar .saidas que explode TypeError;
  // ?? Se o valor da esquerda for null ou undefined, troca pelo da direita
  // ?? e || são diferentes!
  const totalSaidas = dados.resumo?.saidas ?? 0;
  const totalAcertos = dados.resumo?.acertos ?? 0;
  const totalEntradas = dados.resumo?.entradas ?? 0;
  const saldoDisponivel = (totalEntradas - totalSaidas).toFixed(2);

  const porcentagemTotal = totalEntradas
    ? Math.min(((totalSaidas / totalEntradas) * 100).toFixed(0), 100)
    : 0;

  const cartao = dados.contas?.find((conta) => conta.tipo === "credito") || {
    limite: 0,
    saldo: 0,
  };
  const cheque = dados.contas?.find(
    (conta) => conta.tipo === "cheque_especial",
  ) || { limite: 0, saldo: 0 };
  const va = dados.contas?.find((conta) => conta.tipo === "va") || {
    limite: 0,
    saldo: 0,
  };

  cartao.limiteDisponivel = (cartao.limite ?? 0) - (cartao.saldo ?? 0);
  va.limiteDisponivel = (va.limite ?? 0) - (va.saldo ?? 0);
  cheque.limiteDisponivel = (cheque.limite ?? 0) - (cheque.saldo ?? 0);

  return (
    <div className="flex flex-col justify-between bg-[#F0F0F7]">
      <div className="flex flex-col p-5 mb-18 gap-4">
        <div className="w-full flex flex-col justify-between gap-2">
          <div>
            <h1>
              <span className="text-sm text-[#aeaeb5] font-light">
                {saudacao()}
              </span>
              <span className="text-xl text-[#1a1a3b] font-semibold">
                {usuarioPrimeiroNome} 👋
              </span>
            </h1>
          </div>
          <SelectMes
            mes={filtro.mes}
            mesAtual={mesAtual}
            onMudarMes={onMudarMes}
          />
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-row items-center gap-4">
          <CircularProgress porcentagem={porcentagemTotal} />
          <div className="flex-1 w-full">
            <h2 className="text-xs text-[#aeaeb5]">Total gasto esse mês:</h2>
            <span className="text-xl font-semibold text-[#EB7070]">
              R$ {totalSaidas}
              <br />
            </span>
            <span className="text-xs text-[#aeaeb5]">
              Total com acertos: <br />
            </span>
            <span className="text-base font-semibold text-[#d6b03a]">
              R$ {(totalAcertos + totalSaidas).toFixed(2)} <br />
            </span>
            <span className="text-xs text-[#aeaeb5]">
              Saldo disponível: <br />
            </span>
            <span className="text-base font-semibold text-[#68C18C]">
              R$ {saldoDisponivel}
            </span>
          </div>
        </div>

        <div className=" bg-white p-4 rounded-3xl shadow-sm flex flex-row gap-2">
          <div>
            <div className="bg-[#fbebdd] p-2 rounded-full">
              <CreditCard className="text-[#e08b45] w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#aeaeb5]">
                Cartão de Crédito Inter
              </span>
              <span className="text-base font-semibold text-[#e08b45]">
                R$ {(cartao.saldo ?? 0).toFixed(2)}
              </span>
            </div>
            <progress
              value={
                cartao.limite ? Math.min(cartao.saldo / cartao.limite, 1) : 0
              }
              className="w-full h-2 appearance-none rounded-full [&::-webkit-progress-bar]:bg-[#fbebdd] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#e08b45] [&::-webkit-progress-value]:rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#aeaeb5]">Limite disponível:</span>
              <span className="text-xs text-[#aeaeb5] font-semibold">
                R$ {cartao.limiteDisponivel ?? 0} de{" "}
                {(cartao.limite ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className=" bg-white p-4 rounded-3xl shadow-sm flex flex-row gap-2">
          <div>
            <div className="bg-[#d9f0e5] p-2 rounded-full">
              <CreditCard className="text-[#2f9f6f] w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#aeaeb5]">Vale Alimentação</span>
              <span className="text-base font-semibold text-[#2f9f6f]">
                R$ {(va.saldo ?? 0).toFixed(2)}
              </span>
            </div>
            <progress
              value={va.limite ? Math.min(va.saldo / va.limite, 1) : 0}
              className="w-full h-2 appearance-none rounded-full [&::-webkit-progress-bar]:bg-[#d9f0e5] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#2f9f6f] [&::-webkit-progress-value]:rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#aeaeb5]">Limite disponível:</span>
              <span className="text-xs text-[#aeaeb5] font-semibold">
                R$ {(va.limiteDisponivel ?? 0).toFixed(2)} de{" "}
                {(va.limite ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className=" bg-white p-4 rounded-3xl shadow-sm flex flex-row gap-2">
          <div>
            <div className="bg-[#e9f0fa] p-2 rounded-full">
              <CreditCard className="text-[#7fa8d6] w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#aeaeb5]">
                Cheque Especial Caixa
              </span>
              <span className="text-base font-semibold text-[#7fa8d6]">
                R$ {(cheque.saldo ?? 0).toFixed(2)}
              </span>
            </div>
            <progress
              value={
                cheque.limite ? Math.min(cheque.saldo / cheque.limite, 1) : 0
              }
              className="w-full h-2 appearance-none rounded-full [&::-webkit-progress-bar]:bg-[#e9f0fa] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#7fa8d6] [&::-webkit-progress-value]:rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#aeaeb5]">Limite disponível:</span>
              <span className="text-xs text-[#aeaeb5] font-semibold">
                R$ {(cheque.limiteDisponivel ?? 0).toFixed(2)} de{" "}
                {(cheque.limite ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white p-4 rounded-3xl shadow-sm gap-1">
          <h2 className="text-md font-semibold">Ranking de Gastos</h2>
          <span className="text-xs text-[#9B93A8]">
            {mesAtual} • Total R$ {totalSaidas}
          </span>
          <div className="mt-3 flex flex-col gap-3">
            {dados.top?.map((n) => {
              const porcentagemItem = totalSaidas
                ? Math.min(
                    ((n.total_gasto / totalSaidas) * 100).toFixed(0),
                    100,
                  )
                : 0;

              return (
                <div
                  key={n.categoria_id}
                  className="relative flex items-center justify-between p-3 bg-[#F5F5F9] rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 rounded-2xl"
                    style={{
                      width: `${porcentagemItem}%`,
                      backgroundColor: n.cor_secundaria,
                    }}
                  />
                  <div className="flex items-center gap-2 z-10">
                    <DynamicIcon
                      name={n.icone}
                      className="w-4 h-4"
                      color={n.cor_primaria}
                    />
                    <span className="text-sm font-semibold text-[#3A3248]">
                      {n.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 z-10">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: n.cor_primaria }}
                    >
                      {porcentagemItem}%
                    </span>
                    <span className="text-sm text-[#9B93A8]">
                      R${n.total_gasto.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <GraficoGastosScroll dados={dados.diario} />
      </div>

      <NavBar />
    </div>
  );
}
