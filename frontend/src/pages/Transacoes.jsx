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
} from "lucide-react";

export default function Pendentes() {
  const navigate = useNavigate();

  const [filtroLista, setFiltroLista] = useState("Todas");
  const [filtroData, setFiltroData] = useState("Data da transação");

  const [transacoes, setTransacoes] = useState();

  async function buscarTransacoes() {
    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transacoes`,
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
            onClick={() => setFiltroLista("Todas")}
            className={`text-[0.8rem] rounded-full p-2 ${filtroLista === "Todas" ? "text-[#2C2438] font-semibold ring-2 ring-inset ring-[#ECEAFA]" : ""}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroLista("Entradas")}
            className={`text-[0.8rem] rounded-full p-2 transition-colors ${filtroLista === "Entradas" ? "text-white bg-[#2F9F6F] font-medium" : "text-[#A89FC9]"}`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFiltroLista("Saídas")}
            className={`text-[0.8rem] rounded-full p-2 transition-colors ${filtroLista === "Saídas" ? "text-white bg-[#D16B6B] font-medium" : "text-[#A89FC9]"}`}
          >
            Saídas
          </button>
        </div>
        <div>
          <p className="text-[0.7rem] text-[#9B93A8] mb-1">Ordenar por</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroData("Data da transação")}
              className={`flex items-center rounded-full gap-1 px-2 py-1 shadow transition-colors ${filtroData === "Data da transação" ? "bg-[#8B7BC7]" : "bg-white"}`}
            >
              <Calendar
                color={
                  filtroData === "Data da transação" ? "#FFFFFF" : "#9B93A8"
                }
                size={12}
              />
              <span
                className={`text-[0.7rem] ${filtroData === "Data da transação" ? "text-white" : "text-[#8B8494]"}`}
              >
                Data da transação
              </span>
            </button>
            <button
              onClick={() => setFiltroData("Criação")}
              className={`flex items-center rounded-full gap-1 px-2 py-1 shadow transitions-colors ${filtroData === "Criação" ? "bg-[#8B7BC7]" : "bg-white"}`}
            >
              <Clock
                color={filtroData === "Criação" ? "#FFFFFF" : "#9B93A8"}
                size={12}
              />
              <span
                className={`text-[0.7rem] ${filtroData === "Criação" ? "text-white" : "text-[#8B8494]"}`}
              >
                Criação
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white">
        {transacoes.map((transacao) => (
          <div>
            <span>{transacao.descricao}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
