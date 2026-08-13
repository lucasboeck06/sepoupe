import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function NovaTransacao() {
  const [centavos, setCentavos] = useState(0);

  const [operacaoTipo, setOperacaoTipo] = useState("PIX");

  const [descricao, setDescricao] = useState("");
  const inputRef = useRef(null);

  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Função padrão de matar acentos e retornar somente o texto puro
  function semAcento(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const visiveis = busca
    ? // Filter é usado para filtrar os elementos
      // Nós usamos semAcento e toLower para deixar tudo cru e comparar
      // (categoria da vez) => recebe categoria limpa e sem acento, comparada com o digitado limpo e sem acento
      categorias
        .filter((c) =>
          semAcento(c.nome.toLowerCase()).includes(
            semAcento(busca.toLowerCase()),
          ),
        )
        .slice(0, 7)
    : // Limita o início em 7 categorias (caso não haja busca)
      categorias.slice(0, 7);

  const [categoriaId, setCategoriaId] = useState(null);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  // No campo do valor, substitui tudo que não é dígito, por nada
  function handleValor(e) {
    const digitos = e.target.value.replace(/\D/g, "");
    setCentavos(Number(digitos));
  }

  // Formata o insert para o modelo braasileiro e trazendo o efeito de direita para esquerda
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

  async function criar() {
    if (!centavos || !operacaoTipo || !descricao || !categoriaId || !data) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/transacoes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({
          descricao,
          categoriaId,
          valor: centavos / 100,
          operacaoTipo,
          data,
        }),
      },
    );

    if (!resposta.ok) {
      alert("Erro ao salvar!");
      return;
    }

    alert("Transacao criada!");
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex flex-row items-center gap-2">
        <ChevronLeft color="#2c2438" size={18} />
        <h1 className="text-[#2c2438] font-semibold text-md">Nova Transacao</h1>
      </div>

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Valor</p>
      <input
        inputMode="numeric"
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl p-3 w-full font-black text-[#2c2438] outline-none"
        value={valorFormatado}
        onChange={handleValor}
      />

      <p className="mt-3 mb-2 text-[#9c93a9] text-xs font-medium">
        Forma do pagamento
      </p>
      <div className="flex flex-row gap-2">
        {["PIX", "Débito", "Crédito", "Cheque E.", "Dinheiro"].map((metodo) => (
          <button
            key={metodo}
            type="button"
            onClick={() => setOperacaoTipo(metodo)}
            className={`px-4 py-2 rounded-full text-xs font-medium ${operacaoTipo === metodo ? "bg-[#8B7BC7] text-white" : "bg-[#f0eef6] text-[#9c93a9]"}`}
          >
            {metodo}
          </button>
        ))}
      </div>

      <p className="mt-3 mb-2 text-[#9c93a9] text-xs font-medium">Descrição</p>
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
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
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-transparent outline-none text-[0.90rem] text-[#2c2438] font-normal placeholder:text-xs placeholder:text-[#b0a9bd]"
        />
      </div>

      <div className="grid grid-cols-4 gap-x-3 items-start mt-3 h-35">
        <button
          type="button"
          className={`flex flex-col justify-center items-center gap-1 py-2`}
        >
          <span
            className={`border border-dashed border-[#d8d2e7] w-10 h-10 rounded-xl flex items-center justify-center bg-[#F4F2F7]`}
          >
            <Plus className="text-[#8c7bc7]" size={18} />
          </span>
          <span className="text-[0.70rem] text-center leading-tight">
            Adicionar
          </span>
        </button>

        {visiveis.map((cat) => (
          <button
            key={cat.id}
            type="button"
            // Cada volta do map cria um arrow function próprio para a categoria!
            onClick={() => setCategoriaId(cat.id)}
            className={`flex flex-col justify-center items-center gap-1 py-2 ${categoriaId === cat.id ? "bg-[#FAFAFA] rounded-2xl transition-colors" : ""}`}
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
            <span className="text-[0.70rem] text-center leading-tight">
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

      <button
        onClick={criar}
        className="mt-6 bg-[#8B7BC7] text-white text-[0.90rem] font-semibold rounded-2xl p-4 w-full"
      >
        Criar transação
      </button>
    </div>
  );
}
