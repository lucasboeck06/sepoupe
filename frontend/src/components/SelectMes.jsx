import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Calendar,
  RotateCcw,
} from "lucide-react";

export default function SelectMes({ mes, mesAtual, onMudarMes }) {
  const [seletorMes, setSeletorMes] = useState(false);

  const [, mesAtualNumero] = mesAtual.split("-").map(Number);

  function selecionarMes(numeroMes) {
    const [ano] = mes.split("-");
    const mesFormatado = String(numeroMes).padStart(2, "0");

    onMudarMes(`${ano}-${mesFormatado}`);
    setSeletorMes(false);
  }

  const MESES = [
    { numero: 1, label: "Jan" },
    { numero: 2, label: "Fev" },
    { numero: 3, label: "Mar" },
    { numero: 4, label: "Abr" },
    { numero: 5, label: "Mai" },
    { numero: 6, label: "Jun" },
    { numero: 7, label: "Jul" },
    { numero: 8, label: "Ago" },
    { numero: 9, label: "Set" },
    { numero: 10, label: "Out" },
    { numero: 11, label: "Nov" },
    { numero: 12, label: "Dez" },
  ];

  function formatarMesExibicao(mesString) {
    const [ano, mes] = mesString.split("-").map(Number);
    const data = new Date(ano, mes - 1, 1);
    const texto = data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  const [anoAtual] = mesAtual.split("-").map(Number);

  function mudarMes(delta) {
    const [ano, mesNum] = mes.split("-").map(Number);
    const totalMeses = ano * 12 + (mesNum - 1) + delta;

    const anoCalculado = Math.floor(totalMeses / 12);
    const mesCalculado = (totalMeses % 12) + 1;

    if (anoCalculado < anoAtual) return;

    const totalMesLimite = anoAtual * 12 + mesAtualNumero;
    if (totalMeses > totalMesLimite) return;

    const mesFormatado = String(mesCalculado).padStart(2, "0");
    onMudarMes(`${anoCalculado}-${mesFormatado}`);
  }

  const [anoSelecionado, mesSelecionado] = mes.split("-").map(Number);

  const totalMesSelecionado = anoSelecionado * 12 + mesSelecionado;
  const totalMesLimite = anoAtual * 12 + mesAtualNumero;

  const noLimiteSuperior = totalMesSelecionado >= totalMesLimite;
  const noLimiteInferior = anoSelecionado <= anoAtual && mesSelecionado === 1;

  return (
    <div className="relative flex items-center justify-between bg-white rounded-full p-2 mb-3 shadow">
      <button
        onClick={() => mudarMes(-1)}
        disabled={noLimiteInferior}
        className={`bg-[#F4F2F7] rounded-full p-1 ${noLimiteInferior ? "opacity-30" : ""}`}
      >
        <ChevronLeft color="#8B7BC7" size={20} />
      </button>
      <button
        className="flex items-center gap-2"
        onClick={() => setSeletorMes((atual) => !atual)}
      >
        <Calendar color="#8B7BC7" size={14} />
        <span className="text-[0.8rem] text-[#2C2438] font-semibold">
          {formatarMesExibicao(mes)}
        </span>
        <ChevronDown color="#B0A9BC" size={14} />
      </button>

      <div
        className={`absolute w-full top-full left-1/2 -translate-x-1/2 block mt-1.5 bg-white rounded-2xl shadow-lg px-4 py-2 z-50 transition-all duration-300 ${seletorMes ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
      >
        <div className="w-full grid grid-cols-3">
          {MESES.map((mes) => (
            <button
              className={`text-[0.85rem] font-medium py-2.5 ${mesSelecionado === mes.numero ? "bg-[#8B7BC7] text-white rounded-xl" : ""} ${mesAtualNumero < mes.numero ? "opacity-30" : ""}`}
              key={mes.numero}
              type="button"
              // Condição para não conseguir clicar em meses no futuro
              disabled={mesAtualNumero < mes.numero}
              onClick={() => selecionarMes(mes.numero)}
            >
              {mes.label}
            </button>
          ))}
        </div>
        <div className="flex-col justify-center w-full">
          <span className="block w-full bg-[#F0EEF5] h-px rounded-full mt-0.3"></span>
          <button
            className="w-full flex items-center justify-center text-[#8B7BC7] font-medium gap-1 mt-1.5"
            onClick={() => selecionarMes(mesAtualNumero)}
          >
            <RotateCcw size={13} />
            <p className="text-[0.85rem]">Mês atual</p>
          </button>
        </div>
      </div>

      <button
        onClick={() => mudarMes(1)}
        disabled={noLimiteSuperior}
        className={`bg-[#F4F2F7] rounded-full p-1 ${noLimiteSuperior ? "opacity-30" : ""}`}
      >
        <ChevronRight color="#8B7BC7" size={20} />
      </button>
    </div>
  );
}
