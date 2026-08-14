import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Search, Plus, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useThemeColor } from "../hooks/useThemeColor";
import { useNavigate } from "react-router-dom";

export default function NovaTransacao() {
  useThemeColor("#FFFFFF");

  const navigate = useNavigate();

  const [centavos, setCentavos] = useState(0);

  const [operacaoTipo, setOperacaoTipo] = useState("PIX");

  const [descricao, setDescricao] = useState("");
  const inputRef = useRef(null);

  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);

  const [categoriaId, setCategoriaId] = useState(null);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const [cardAberto, setCardAberto] = useState(false);
  const [tipoCategoria, setTipoCategoria] = useState("Saída");
  const [categoriaNome, setCategoriaNome] = useState("");

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono, setState roda fora do render síncrono
    buscarCategorias();
  }, []);

  async function criarTransacao() {
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

    setCentavos(0);
    setDescricao("");
    setCategoriaId(null);
    setOperacaoTipo("PIX");
    setBusca("");
  }

  async function criarCategoria() {
    if (!categoriaNome || !tipoCategoria) {
      alert("Nome e tipo da categoria são necessários!");
      return;
    }

    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/categorias`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({
          nome: categoriaNome,
          tipo: tipoCategoria,
        }),
      },
    );

    if (!resposta.ok) {
      const erroDados = await resposta.json().catch(() => ({}));

      const mensagemDoBack = erroDados.err || "Erro desconhecido no servidor!";

      alert(`Erro: ${mensagemDoBack}`);
      return;
    }

    alert("Categoria criada!");

    await buscarCategorias();

    setCategoriaNome("");
    setTipoCategoria("Saída");
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex flex-row items-center gap-2">
        <button onClick={() => navigate("/dashboard")}>
          <ChevronLeft color="#2c2438" size={22} />
        </button>
        <h1 className="text-[#2c2438] font-bold text-[1.2rem]">
          Nova Transacao
        </h1>
      </div>

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Valor</p>
      <input
        inputMode="numeric"
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-4 w-full text-[1.4rem] font-black text-[#2c2438] outline-none"
        value={valorFormatado}
        onChange={handleValor}
      />

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">
        Forma do pagamento
      </p>
      <div className="flex flex-row gap-2">
        {["PIX", "Débito", "VA", "Crédito", "Cheque", "Dinheiro"].map(
          (metodo) => (
            <button
              key={metodo}
              type="button"
              onClick={() => setOperacaoTipo(metodo)}
              className={`px-2 py-2 rounded-full text-[0.70rem] font-semibold ${operacaoTipo === metodo ? "bg-[#8B7BC7] text-white" : "bg-[#f0eef6] text-[#9c93a9]"}`}
            >
              {metodo}
            </button>
          ),
        )}
      </div>

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Descrição</p>
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-3 w-full text-md text-[0.90rem] text-[#2c2438] font-normal outline-none placeholder:text-[0.80rem] placeholder:text-[#b0a9bd]"
        placeholder="Ex: Almoço no shopping"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Categoria</p>

      <div
        className="flex items-center gap-2 w-full border-2 border-[#f0eef6] focus-within:border-[#ece6f7] rounded-2xl px-3 py-3 cursor-text transition-colors mt-2"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-4 h-4 text-[#b0a9bd]" />

        <input
          ref={inputRef}
          placeholder="Pesquise a categoria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-transparent outline-none text-[0.90rem] text-[#2c2438] font-normal placeholder:text-[0.80rem] placeholder:text-[#b0a9bd]"
        />
      </div>

      <div className="grid grid-cols-4 gap-x-3 items-start mt-3 h-35">
        <button
          type="button"
          className={`flex flex-col justify-center items-center gap-1 py-2`}
          onClick={() => setCardAberto(true)}
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

      <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Data</p>
      <input
        type="date"
        className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-3 w-full text-[0.90rem] text-[#2c2438] font-normal outline-none"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button
        onClick={criarTransacao}
        className="mt-6 bg-[#8B7BC7] text-white text-[0.90rem] font-semibold rounded-2xl p-4 w-full"
      >
        Criar transação
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          cardAberto
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-white rounded-t-4xl p-8 flex flex-col justify-center items-center transition-transform duration-300 ease-out transform ${
          cardAberto ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="bg-[#f0eef6] h-1.5 w-16 rounded-full mb-5"></span>
        <div className="w-full flex flex-row justify-between">
          <h1 className="font-semibold text-[1.10rem]">Criar categoria</h1>
          <button onClick={() => setCardAberto(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="w-full flex items-start">
          <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Nome</p>
        </div>
        <input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="border-2 border-[#f0eef6] focus:border-[#ece6f7] rounded-2xl px-3 py-3 w-full text-md text-[0.90rem] text-[#2c2438] font-normal outline-none placeholder:text-[0.80rem] placeholder:text-[#b0a9bd]"
          placeholder="Ex: Pet, Viagens, Investimentos..."
          value={categoriaNome}
          onChange={(e) => setCategoriaNome(e.target.value)}
        />
        <div className="w-full flex items-start">
          <p className="mt-4 mb-2 text-[#9c93a9] text-xs font-medium">Tipo</p>
        </div>
        <div className="w-full bg-[#F4F2F7] p-1.5 rounded-full">
          {["Saída", "Entrada"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoCategoria(tipo)}
              className={`w-1/2 rounded-full p-2 text-[0.85rem] font-semibold ${tipoCategoria === tipo ? (tipoCategoria === "Saída" ? "bg-[#D16B6B] text-white" : "bg-[#309f6f] text-white") : ""}`}
            >
              {tipo}
            </button>
          ))}
        </div>
        <button
          onClick={criarCategoria}
          className="mt-6 bg-[#8B7BC7] text-white text-[0.90rem] font-semibold rounded-2xl p-4 w-full"
        >
          Criar categoria
        </button>
      </div>
    </div>
  );
}
