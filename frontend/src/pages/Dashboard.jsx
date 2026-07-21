import NavBar from "../components/NavBar.jsx";
import RankGastos from "../components/RankGastos.jsx";
import GraficoGastosScroll from "../components/GraficoGastosScroll.jsx";
import { Bell, CreditCard } from "lucide-react";
import CircularProgress from "../components/CircularProgress.jsx";

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-between bg-[#F0F0F7]">
      <div className="flex flex-col p-5 mb-18 gap-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1>
              <span className="text-sm text-[#aeaeb5] font-light">
                Boa tarde,
              </span>
              <br />
              <span className="text-xl text-[#1a1a3b] font-semibold">
                Lucas 👋
              </span>
            </h1>
          </div>

          <div className="bg-[#e1e1f7] p-3 rounded-full">
            <Bell className="w-4 h-4 text-[#7a7aff]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-row items-center gap-4">
          <CircularProgress porcentagem={33} />
          <div className="flex-1 w-full">
            <h2 className="text-xs text-[#aeaeb5]">Total gasto esse mês:</h2>
            <span className="text-xl font-semibold text-[#EB7070]">
              R$ 500,00
              <br />
            </span>
            <span className="text-xs text-[#aeaeb5]">
              Saldo disponível: <br />
            </span>
            <span className="text-base font-semibold text-[#68C18C]">
              R$ 1.000,00
            </span>
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
              <span className="text-xs text-[#aeaeb5]">Cartão de crédito</span>
              <span className="text-base font-semibold text-[#7fa8d6]">
                R$ 320,00
              </span>
            </div>
            <progress
              value={0.5}
              className="w-full h-2 appearance-none rounded-full [&::-webkit-progress-bar]:bg-[#e9f0fa] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#7fa8d6] [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-[#7fa8d6]"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#aeaeb5]">Limite disponível:</span>
              <span className="text-xs text-[#aeaeb5] font-semibold">
                R$ 680,00 de R$ 1.000,00
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white p-4 rounded-3xl shadow-sm gap-1">
          <h2 className="text-md font-semibold">Ranking de Gastos</h2>
          <span className="text-xs text-[#9B93A8]">
            Julho 2026 • Total R$4.720,90
          </span>
          <div className="mt-3 gap-3">
            <RankGastos />
          </div>
        </div>

        <GraficoGastosScroll />
      </div>

      <NavBar />
    </div>
  );
}
