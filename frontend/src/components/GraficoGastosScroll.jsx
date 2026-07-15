import { useState } from "react";

export default function GraficoGastosScroll() {
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  // Simulei um cenário onde 310 é o seu maior gasto para provar que o eixo Y se adapta
  const dadosMensais = [
    { dia: 1, valor: 80 },
    { dia: 2, valor: 230 },
    { dia: 3, valor: 40 },
    { dia: 4, valor: 310 },
    { dia: 5, valor: 20 },
    { dia: 6, valor: 250 },
    { dia: 7, valor: 90 },
    { dia: 8, valor: 150 },
    { dia: 9, valor: 280 },
    { dia: 10, valor: 60 },
    { dia: 11, valor: 140 },
    { dia: 12, valor: 10 },
    { dia: 13, valor: 190 },
    { dia: 14, valor: 300 },
    { dia: 15, valor: 70 },
  ];

  // 1. A INTELIGÊNCIA MATEMÁTICA:
  // Descobre qual foi o maior gasto real do mês
  const maiorGasto = Math.max(...dadosMensais.map((item) => item.valor));

  // Arredonda para a próxima centena para o gráfico ter um "respiro" no topo
  // Ex: Se o maior gasto for 310, o teto vira 400. Se for 0, previne divisão por zero.
  const valorMaximo = maiorGasto > 0 ? Math.ceil(maiorGasto / 100) * 100 : 100;

  // Monta as linhas do eixo Y fatiando o valor máximo exatamente em 4 partes
  const eixoY = [
    valorMaximo, // 100% (ex: 400)
    valorMaximo * 0.75, // 75%  (ex: 300)
    valorMaximo * 0.5, // 50%  (ex: 200)
    valorMaximo * 0.25, // 25%  (ex: 100)
    0, // 0%
  ];

  // Busca os dados do dia que o usuário clicou para mostrar no card inferior
  const itemSelecionado = dadosMensais.find(
    (item) => item.dia === diaSelecionado,
  );

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1a1a3b] leading-tight mb-1">
          Gastos Diários
        </h2>
        <span className="text-[13px] font-medium text-[#aeaeb5]">
          Julho 2026 • Média R$ 167/dia
        </span>
      </div>

      {/* Container Principal do Gráfico */}
      <div className="relative flex">
        {/* EIXO Y - Agora totalmente sincronizado com as barras */}
        <div className="flex flex-col justify-between items-end pr-4 text-[11px] font-medium text-[#aeaeb5] h-[150px] shrink-0">
          {eixoY.map((valor, index) => (
            <span key={index} className="leading-none">
              {valor === 0 ? "R$0" : `R$${valor}`}
            </span>
          ))}
        </div>

        {/* ÁREA DO GRÁFICO */}
        <div className="relative flex-1 min-w-0">
          {/* LINHAS TRACEJADAS */}
          <div className="absolute top-0 left-0 right-0 h-[150px] flex flex-col justify-between pointer-events-none z-0">
            {eixoY.map((_, index) => (
              <div
                key={index}
                className="w-full border-t border-dashed border-[#e1e1f7]"
              ></div>
            ))}
          </div>

          {/* ÁREA DE SCROLL (Apenas Barras e Textos) */}
          <div
            className="flex gap-5 overflow-x-auto pb-4 relative z-10
            [&::-webkit-scrollbar]:h-1.5 
            [&::-webkit-scrollbar-track]:bg-[#F0F0F7] [&::-webkit-scrollbar-track]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-[#D1D1E0] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {dadosMensais.map((item) => {
              // A matemática agora é à prova de balas
              const alturaPorcentagem = (item.valor / valorMaximo) * 100;
              const isSelected = diaSelecionado === item.dia;

              return (
                <div
                  key={item.dia}
                  onClick={() =>
                    setDiaSelecionado(isSelected ? null : item.dia)
                  }
                  className="flex flex-col items-center shrink-0 w-8 gap-2 relative cursor-pointer group"
                >
                  {/* FUNDO CINZA DE SELEÇÃO */}
                  <div
                    className={`absolute top-0 w-full h-[150px] rounded-md transition-colors duration-200 ${
                      isSelected
                        ? "bg-[#e1e1f7]/60"
                        : "group-hover:bg-[#F0F0F7]/50"
                    }`}
                  />

                  {/* CONTAINER DA BARRA */}
                  <div className="w-6 h-[150px] flex items-end relative z-10 pointer-events-none">
                    <div
                      className="w-full bg-[#ece6f7] rounded-t-md transition-all duration-1000 ease-out"
                      style={{ height: `${alturaPorcentagem}%` }}
                    />
                  </div>

                  {/* TEXTO DO DIA */}
                  <span className="text-[12px] font-medium text-[#aeaeb5] relative z-10 pointer-events-none">
                    {item.dia}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ÁREA INFERIOR: Onde a mágica acontece ao invés do tooltip flutuante */}
      <div className="flex items-center justify-center h-[40px] mt-2 mb-2">
        {itemSelecionado ? (
          <div className="bg-[#F0F0F7] px-5 py-2 rounded-full flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[14px] font-bold text-[#1a1a3b]">
              Dia {itemSelecionado.dia}
            </span>
            <span className="w-1.5 h-1.5 bg-[#D1D1E0] rounded-full"></span>
            <span className="text-[14px] font-medium text-[#1a1a3b]">
              Gasto: R$ {itemSelecionado.valor}
            </span>
          </div>
        ) : (
          <span className="text-[12px] font-medium text-[#aeaeb5] animate-in fade-in duration-200">
            Toque em uma coluna para ver os detalhes
          </span>
        )}
      </div>

      <p className="text-center text-[11px] font-medium text-[#aeaeb5]">
        ◂ Arraste para o lado para ver o mês completo ▸
      </p>
    </div>
  );
}
