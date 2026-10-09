import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Wallet, X } from "lucide-react";
import { api } from "../lib/api";

export default function Capital() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({ patrimonio: 0, conta: 0, poupanca: 0 });

  const [cardAberto, setCardAberto] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState("Sacar");

  const [centavos, setCentavos] = useState(0);

  const [enviando, setEnviando] = useState(false);

  // No campo do valor, substitui tudo que não é dígito, por nada
  function handleValor(e) {
    const digitos = e.target.value.replace(/\D/g, "");
    setCentavos(Number(digitos));
  }

  // Formata o insert para o modelo brasileiro e trazendo o efeito de direita para esquerda
  const valorFormatado = (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  async function buscarDados() {
    const resposta = await api("/capital", "GET");

    setDados(resposta);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarDados();
  }, []);

  async function resgatar() {
    if (!centavos) {
      alert(`O valor não pode ser nulo!`);
      return;
    }

    setEnviando(true);
    try {
      await api("/conta/resgatar", "POST", { valor: centavos / 100 });

      setCentavos(0);
      setCardAberto(false);

      await buscarDados();
    } finally {
      setEnviando(false);
    }
  }

  async function investir() {
    if (!centavos) {
      alert(`O valor não pode ser nulo!`);
      return;
    }

    setEnviando(true);
    try {
      await api("/conta/investir", "POST", { valor: centavos / 100 });

      setCentavos(0);
      setCardAberto(false);

      await buscarDados();
    } finally {
      setEnviando(false);
    }
  }

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
            R$ {dados.patrimonio.toFixed(2)}
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
          <p className="text-[1.1rem] font-bold text-[#2C2438]">
            R$ {dados.conta.toFixed(2)}
          </p>
        </div>
        <div
          onClick={() => setCardAberto(true)}
          className="flex items-center justify-between bg-[#FFFFFF] shadow-sm rounded-2xl p-3"
        >
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
          <p className="text-[1.1rem] font-bold text-[#2C2438]">
            R$ {dados.poupanca.toFixed(2)}
          </p>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${cardAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-white rounded-t-4xl p-8 flex flex-col justify-center items-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${cardAberto ? "translate-y-0" : "translate-y-full"}`}
      >
        <span className="bg-[#f0eef6] h-1.5 w-16 rounded-full mb-5"></span>
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex gap-3">
            <span className="h-10 w-10 flex items-center justify-center bg-[#D9F0E5] rounded-xl">
              <Wallet size={18} className="text-[#2F9F6F]" />
            </span>
            <div>
              <h3 className="text-[0.8rem] text-[#2C2438] font-semibold">
                Poupança
              </h3>
              <p className="text-[0.75rem] font-normal text-[#9B93A8]">
                Saldo: R$ {dados.poupanca.toFixed(2)}
              </p>
            </div>
          </div>
          <button onClick={() => setCardAberto(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="w-full bg-[#F4F2F7] p-1.5 rounded-full">
          {["Sacar", "Investir"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoMovimentacao(tipo)}
              className={`w-1/2 rounded-full p-2 text-[0.85rem] font-semibold ${tipoMovimentacao === tipo ? (tipoMovimentacao === "Sacar" ? "bg-[#D16B6B] text-white" : "bg-[#309f6f] text-white") : ""}`}
            >
              {tipo}
            </button>
          ))}
        </div>
        <p className="w-full mt-4 mb-2 text-[#9c93a9] text-xs font-medium">
          Valor
        </p>
        <input
          inputMode="numeric"
          className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-4 w-full text-[1.4rem] font-black text-[#2c2438] outline-none"
          value={valorFormatado}
          onChange={handleValor}
        />
        <div
          className={`w-full flex justify-start bg-[#E9F0FA] p-3 rounded-xl gap-2 mt-3 ${tipoMovimentacao === "Sacar" ? "hidden" : ""}`}
        >
          <Wallet size={16} className="text-[#1E64CC]" />
          <p className="text-[#2C2438] text-[0.78em]">
            Disponível na conta: R$ {dados.conta.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() =>
            tipoMovimentacao === "Sacar" ? resgatar() : investir()
          }
          disabled={enviando}
          className={`mt-4 text-white text-[0.90rem] font-semibold rounded-2xl p-4 w-full transition-colors duration-300 disabled:opacity-50 ${tipoMovimentacao === "Sacar" ? "bg-[#D16B6B]" : "bg-[#309f6f]"}`}
        >
          {enviando
            ? "Salvando..."
            : `Confirmar ${tipoMovimentacao === "Sacar" ? "saque" : "investimento"}`}
        </button>
      </div>
    </div>
  );
}
