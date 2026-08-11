import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function NovaTransacao() {
  const [centavos, setCentavos] = useState(0);
  const [descricao, setDescricao] = useState("");
  const inputRef = useRef(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  function handleValor(e) {
    const digitos = e.target.value.replace(/\D/g, "");
    setCentavos(Number(digitos));
  }

  const valorFormatado = (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    async function buscarCategorias() {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/categorias`,
        {
          method: "GET",
          headers: { "ngrok-skip-browser-warning": "true" },
          credentials: "include",
        },
      );
      const dados = await resposta.json();
      setCategorias(dados);
    }

    buscarCategorias();
  }, []);

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-row items-center gap-2">
        <ChevronLeft color="#2c2438" size={18} />
        <h1 className="text-[#2c2438] font-semibold text-md">Nova Transacao</h1>
      </div>

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Valor</p>
      <input
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl p-3 w-full font-black text-[#2c2438] outline-none"
        value={valorFormatado}
        onChange={handleValor}
      />

      <p className="mt-3 mb-2 text-[#9c93a9] text-xs font-medium">Descrição</p>
      <input
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-2 w-full text-md text-[0.90rem] text-[#2c2438] font-normal outline-none placeholder:text-xs placeholder:text-[#b0a9bd]"
        placeholder="Ex: Almoço no shopping"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <p className="mt-3 mb-2 text-[#9c93a9] text-xs font-medium">Categoria</p>

      <div
        className="flex items-center gap-2 w-full border-2 border-[#f0eef6] focus-within:border-[#ece6f7] rounded-2xl px-3 py-2 cursor-text transition-colors mt-2"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-4 h-4 text-[#b0a9bd]" />

        <input
          ref={inputRef}
          placeholder="Pesquise a categoria"
          className="w-full bg-transparent outline-none text-[0.90rem] text-[#2c2438] font-normal placeholder:text-xs placeholder:text-[#b0a9bd]"
        />
      </div>

      <div className="grid grid-cols-4 gap-x-3 items-start mt-3">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            // Cada volta do map cria um arrow function próprio para a categoria!
            onClick={() => setCategoriaId(cat.id)}
            className={`flex flex-col justify-center items-center gap-1 py-2 ${categoriaId === cat.id ? "ring-2 border-purple-500" : ""}`}
          >
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center`}
              style={{ backgroundColor: cat.cor_secundaria }}
            >
              <DynamicIcon
                name={cat.icone}
                color={cat.cor_primaria}
                size={16}
              />
            </span>
            <span className="text-[0.55rem] text-center leading-tight">
              {cat.nome}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 mb-2 text-[#9c93a9] text-xs font-medium">Data</p>
      <input
        type="date"
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-2 w-full text-[0.90rem] text-[#2c2438] font-normal outline-none"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button className="mt-6 bg-[#8B7BC7] text-white text-[0.80rem] font-semibold rounded-2xl p-3 w-full">
        Criar transação
      </button>
    </div>
  );
}
