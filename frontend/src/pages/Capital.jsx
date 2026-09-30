import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Wallet } from "lucide-react";

export default function Capital() {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);

  async function buscarDados() {
    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/capital`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (resposta.status === 401) {
      localStorage.removeItem("usuario-logado");
      window.location.href = "/";
      return;
    }

    const dados = await resposta.json();
    setDados(dados);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarDados();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-5">
        <div className="flex gap-3 items-center mb-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white rounded-full p-1 shadow-sm"
          >
            <ChevronLeft color="#2c2438" size={22} />
          </button>
          <h1 className="text-[1.2rem] text-[#2C2438] font-semibold">
            Capital
          </h1>
        </div>
        <div className="bg-[#FFFFFF] py-4 px-5 rounded-3xl shadow-sm">
          <h2 className="text-[#9B93A8] text-[0.8rem] mb-1">
            Patrimônio total
          </h2>
          <p className="text-[#2C2438] text-[1.6rem] font-bold">
            R$ {Number(dados.patrimonio).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex flex-col flex-1 bg-[#FFFFFF] p-5 gap-4">
        <div className="flex items-center justify-between bg-[#FFFFFF] shadow-sm rounded-2xl p-3">
          <div className="flex gap-3">
            <span className="h-10 w-10 flex items-center justify-center bg-[#E9F0FA] rounded-xl">
              <Wallet size={18} className="text-[#1E64CC]" />
            </span>
            <div>
              <h3 className="text-[0.75rem] text-[#2C2438] font-semibold">
                Conta corrente
              </h3>
              <p className="text-[0.75rem] font-normal text-[#9B93A8]">
                Disponível para gastar
              </p>
            </div>
          </div>
          <p className="text-[1.1rem] font-bold text-[#2C2438]">R$ 3.000</p>
        </div>
        <div className="flex items-center justify-between bg-[#FFFFFF] shadow-sm rounded-2xl p-3">
          <div className="flex gap-3">
            <span className="h-10 w-10 flex items-center justify-center bg-[#D9F0E5] rounded-xl">
              <Wallet size={18} className="text-[#2F9F6F]" />
            </span>
            <div>
              <h3 className="text-[0.75rem] text-[#2C2438] font-semibold">
                Poupança
              </h3>
              <p className="text-[0.75rem] font-normal text-[#9B93A8]">
                Investimentos
              </p>
            </div>
          </div>
          <p className="text-[1.1rem] font-bold text-[#2C2438]">R$ 3.000</p>
        </div>
      </div>
    </div>
  );
}
