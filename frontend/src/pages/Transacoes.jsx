import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleArrowDown,
  CircleArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function Transacoes() {
  const navigate = useNavigate();

  const [transacoes, setTransacoes] = useState([]);

  const [popupDelete, setPopupDelete] = useState(false);

  const [transacaoSelecionada, setTransacaoSelecionada] = useState();

  const [filtros, setFiltros] = useState({
    tipo: "todas",
    ordem: "data",
  });

  async function buscarTransacoes() {
    const params = new URLSearchParams({
      tipo: filtros.tipo === "todas" ? "" : filtros.tipo,
      ordem: filtros.ordem,
    });

    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transacoes?${params}`,
      {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true" },
        credentials: "include",
      },
    );

    if (resposta.status === 401) {
      localStorage.removeItem("usuario-logado");
      window.location.href = "/";
      return;
    }

    if (!resposta.ok) {
      const erroDados = await resposta.json().catch(() => ({}));

      const mensagemDoBack = erroDados.err || "Erro desconhecido no servidor!";

      alert(`Erro: ${mensagemDoBack}`);
      return;
    }

    const dados = await resposta.json();
    setTransacoes(dados);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono, setState roda fora do render síncrono
    buscarTransacoes();
  }, []);

  function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  async function deletarTransacao() {
    if (!transacaoSelecionada.id) {
      alert("O id é necessário para deletar uma transação");
      return;
    }

    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transacoes?id=${transacaoSelecionada.id}`,
      {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      },
    );

    if (resposta.status === 401) {
      localStorage.removeItem("usuario-logado");
      window.location.href = "/";
      return;
    }

    if (!resposta.ok) {
      const erroDados = await resposta.json().catch(() => ({}));

      const mensagemDoBack = erroDados.err || "Erro desconhecido no servidor!";

      alert(`Erro: ${mensagemDoBack}`);
      return;
    }

    buscarTransacoes();
    setPopupDelete(false);
    setTransacaoSelecionada(undefined);
  }

  function mudarTipo(novoTipo) {
    setFiltros((atual) => ({ ...atual, tipo: novoTipo }));
  }

  function mudarOrdem(novaOrdem) {
    setFiltros((atual) => ({ ...atual, ordem: novaOrdem }));
  }

  return (
    <div>
      <div className="p-5 bg-[#F4F2F7]">
        <div className="flex gap-3 items-center mb-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white rounded-full p-1 shadow"
          >
            <ChevronLeft color="#2c2438" size={22} />
          </button>
          <h1 className="text-[1.2rem] text-[#2C2438] font-semibold">
            Transações
          </h1>
        </div>
        <div className="flex items-center justify-between bg-white rounded-full p-2 mb-3 shadow">
          <button className="bg-[#F4F2F7] rounded-full p-1">
            <ChevronLeft color="#8B7BC7" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calendar color="#8B7BC7" size={14} />
            <span className="text-[0.8rem] text-[#2C2438] font-semibold">
              Agosto 2026
            </span>
            <ChevronDown color="#B0A9BC" size={14} />
          </div>
          <button className="bg-[#F4F2F7] rounded-full p-1">
            <ChevronRight color="#8B7BC7" size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white rounded-2xl p-3 shadow">
            <div className="flex items-center gap-1">
              <CircleArrowDown color="#2F9F6F" size={14} />
              <h2 className="text-[0.7rem] text-[#9B93A8]">Entradas</h2>
            </div>
            <span className="text-[1rem] text-[#2C2438] font-bold">
              R$ 2.0000
            </span>
          </div>
          <div className=" bg-white rounded-2xl p-3 shadow">
            <div className="flex items-center gap-1">
              <CircleArrowUp color="#D16B6B" size={14} />
              <h2 className="text-[0.7rem] text-[#9B93A8]">Saídas</h2>
            </div>
            <span className="text-[1rem] text-[#2C2438] font-bold">
              R$ 1.000
            </span>
          </div>
        </div>
        <div className="bg-white rounded-full grid grid-cols-3 gap-1.5 p-1.5 mb-3 shadow">
          <button
            onClick={() => mudarTipo("todas")}
            className={`text-[0.8rem] rounded-full p-2 ${filtros.tipo === "todas" ? "text-[#2C2438] font-semibold ring-2 ring-inset ring-[#ECEAFA]" : ""}`}
          >
            Todas
          </button>
          <button
            onClick={() => mudarTipo("entradas")}
            className={`text-[0.8rem] rounded-full p-2 transition-colors ${filtros.tipo === "entradas" ? "text-white bg-[#2F9F6F] font-medium" : "text-[#A89FC9]"}`}
          >
            Entradas
          </button>
          <button
            onClick={() => mudarTipo("saidas")}
            className={`text-[0.8rem] rounded-full p-2 transition-colors ${filtros.tipo === "saidas" ? "text-white bg-[#D16B6B] font-medium" : "text-[#A89FC9]"}`}
          >
            Saídas
          </button>
        </div>
        <div>
          <p className="text-[0.7rem] text-[#9B93A8] mb-1">Ordenar por</p>
          <div className="flex gap-2">
            <button
              onClick={() => mudarOrdem("data")}
              className={`flex items-center rounded-full gap-1 px-2 py-1 shadow transition-colors ${filtros.ordem === "data" ? "bg-[#8B7BC7]" : "bg-white"}`}
            >
              <Calendar
                color={filtros.ordem === "data" ? "#FFFFFF" : "#9B93A8"}
                size={12}
              />
              <span
                className={`text-[0.7rem] ${filtros.ordem === "data" ? "text-white" : "text-[#8B8494]"}`}
              >
                Data da transação
              </span>
            </button>
            <button
              onClick={() => mudarOrdem("criacao")}
              className={`flex items-center rounded-full gap-1 px-2 py-1 shadow transitions-colors ${filtros.ordem === "criacao" ? "bg-[#8B7BC7]" : "bg-white"}`}
            >
              <Clock
                color={filtros.ordem === "criacao" ? "#FFFFFF" : "#9B93A8"}
                size={12}
              />
              <span
                className={`text-[0.7rem] ${filtros.ordem === "criacao" ? "text-white" : "text-[#8B8494]"}`}
              >
                Criação
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white px-4">
        {transacoes.map((transacao) => (
          <div
            key={transacao.id}
            className="flex justify-between  py-3 border-b border-[#FAF9F5]"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ backgroundColor: transacao.cor_secundaria }}
              >
                <DynamicIcon
                  name={transacao.icone}
                  color={transacao.cor_primaria}
                  size={18}
                />
              </span>
              <div>
                <h3 className="text-[0.8rem] text-[#2C2438] font-semibold leading-none">
                  {transacao.descricao}
                </h3>
                <p className="text-[0.7rem] text-[#9B93A8]">
                  {formatarData(transacao.data)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p
                className={`text-[0.9rem] font-semibold ${transacao.tipo === "saida" ? "text-[#D16B6B]" : "text-[#2F9F6F]"}`}
              >
                {transacao.tipo === "saida" ? "- " : "+ "}
                {transacao.valor}
              </p>

              <button
                onClick={() => {
                  setPopupDelete(true);
                  setTransacaoSelecionada(transacao);
                }}
                className="bg-[#F8EBEB] p-2 rounded-lg"
              >
                <Trash2 color="#D16B6B" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`fixed flex items-center justify-center inset-0 z-40 bg-black/50 p-3 transition-opacity duration-300 ${popupDelete ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`bg-white z-50 rounded-3xl p-6 ${popupDelete ? "translate-0" : "translate-full"}`}
        >
          <div className="">
            <button
              onClick={() => setPopupDelete(false)}
              className="p-3 bg-[#F8EBEB] rounded-full"
            >
              <Trash2 color="#D16B6B" size={22} />
            </button>
          </div>
          <div className="mb-4 mt-2">
            <h2 className="text-[1rem] text-[#2C2438] font-semibold">
              Excluir transação?
            </h2>
            <p className="text-[0.8rem] text-[#9B93A8] leading-4.5">
              Essa ação não pode ser desfeita. A transação será removida do seu
              histórico e dos totais do mês
            </p>
          </div>
          <div className="w-full flex items-center justify-between bg-[#F8F7FB] p-3 rounded-xl mb-4">
            <span className="flex gap-2 items items-center">
              <span
                className="flex w-fit p-2 rounded-full"
                style={{
                  backgroundColor: transacaoSelecionada?.cor_secundaria,
                }}
              >
                <DynamicIcon
                  name={transacaoSelecionada?.icone}
                  color={transacaoSelecionada?.cor_primaria}
                  size={18}
                />
              </span>
              <div className="leading-4">
                <p className="text-[0.8rem] text-[#2C2438s] font-semibold">
                  {transacaoSelecionada?.descricao}
                </p>
                <span className="flex text-[0.7rem] text-[#9B93A8]">
                  <p>
                    {transacaoSelecionada?.categoria_nome} <br />
                    {formatarData(transacaoSelecionada?.data)}
                  </p>
                </span>
              </div>
            </span>
            <p
              className={`text-[0.9rem] font-semibold ${transacaoSelecionada?.tipo === "saida" ? "text-[#D16B6B]" : "text-[#2F9F6F]"}`}
            >
              {transacaoSelecionada?.tipo === "saida" ? "- " : "+"}{" "}
              {transacaoSelecionada?.valor}
            </p>
          </div>
          <button
            onClick={deletarTransacao}
            className="w-full bg-[#D16B6B] rounded-xl py-3 text-[0.9rem] font-semibold text-[#FFFFFF] mb-2"
          >
            Excluir
          </button>
          <button
            onClick={() => setPopupDelete(false)}
            className="w-full bg-[#F4F2F7] rounded-xl py-3 text-[0.9rem] font-semibold text-[#8B8494]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
