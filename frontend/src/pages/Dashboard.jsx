import NavBar from "../components/NavBar.jsx";
import RankGastos from "../components/RankGastos.jsx";
import GraficoGastosScroll from "../components/GraficoGastosScroll.jsx";
import { Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-between bg-[#F0F0F7]">
      <div className="flex flex-col p-6 mb-18 gap-4">
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

        <div></div>

        <div>
          <h2>Top de gastos:</h2>
          <RankGastos categoria="Mercado" value={0.5} valor={900.0} />
          <RankGastos categoria="Moto" value={0.5} valor={900.0} />
          <RankGastos categoria="Roupas" value={0.5} valor={900.0} />
          <RankGastos categoria="Fastfood" value={0.5} valor={900.0} />
          <RankGastos categoria="Gasolina" value={0.5} valor={900.0} />
        </div>

        <GraficoGastosScroll />
      </div>

      <NavBar />
    </div>
  );
}
