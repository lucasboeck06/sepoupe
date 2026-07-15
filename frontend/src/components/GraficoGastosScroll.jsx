export default function GraficoGastosScroll() {
  const dadosMensais = [
    { dia: 1, valor: 80 },
    { dia: 2, valor: 230 },
    { dia: 3, valor: 40 },
    { dia: 4, valor: 310 },
    { dia: 5, valor: 20 },
    { dia: 6, valor: 450 },
    { dia: 7, valor: 90 },
    { dia: 8, valor: 150 },
    { dia: 9, valor: 280 },
    { dia: 10, valor: 60 },
    { dia: 11, valor: 340 },
    { dia: 12, valor: 10 },
    { dia: 13, valor: 190 },
    { dia: 14, valor: 400 },
    { dia: 15, valor: 70 },
  ];

  const eixoY = [600, 450, 300, 150, 0];
  const valorMaximo = 600;

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
        {/* EIXO Y - Agora com altura cravada de 150px */}
        <div className="flex flex-col justify-between items-end pr-4 text-[11px] font-medium text-[#aeaeb5] h-[150px] shrink-0">
          {eixoY.map((valor, index) => (
            <span key={index} className="leading-none">
              {valor === 0 ? "R$0" : `R$${valor}`}
            </span>
          ))}
        </div>

        {/* ÁREA DO GRÁFICO (Linhas e Barras) */}
        {/* min-w-0 é um truque do flexbox para permitir que o scroll horizontal funcione */}
        <div className="relative flex-1 min-w-0">
          {/* LINHAS TRACEJADAS DE FUNDO */}
          {/* Também com os mesmos 150px de altura para bater perfeitamente com os números */}
          <div className="absolute top-0 left-0 right-0 h-[150px] flex flex-col justify-between pointer-events-none z-0">
            {eixoY.map((_, index) => (
              <div
                key={index}
                className="w-full border-t border-dashed border-[#e1e1f7]"
              ></div>
            ))}
          </div>

          {/* ÁREA DE SCROLL (Barras + Textos dos dias) */}
          <div
            className="flex gap-5 overflow-x-auto pb-4 relative z-10
            [&::-webkit-scrollbar]:h-1.5 
            [&::-webkit-scrollbar-track]:bg-[#F0F0F7] [&::-webkit-scrollbar-track]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-[#D1D1E0] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {dadosMensais.map((item) => {
              // A matemática pura: se o gasto é 300 e o max é 600, a altura é 50%
              const alturaPorcentagem = (item.valor / valorMaximo) * 100;

              return (
                <div
                  key={item.dia}
                  className="flex flex-col items-center shrink-0 w-7 gap-2"
                >
                  {/* O SEGREDO TÁ AQUI: Um container só para a barra, cravado em 150px */}
                  <div className="w-full h-[150px] flex items-end">
                    <div
                      className="w-full bg-[#ece6f7] rounded-t-md transition-all duration-1000 ease-out"
                      style={{ height: `${alturaPorcentagem}%` }}
                    />
                  </div>

                  {/* O texto do dia fica solto em baixo, sem afetar o cálculo da altura */}
                  <span className="text-[12px] font-medium text-[#aeaeb5]">
                    {item.dia}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] font-medium text-[#aeaeb5] mt-2">
        ◂ Arraste para o lado para ver o mês completo ▸
      </p>
    </div>
  );
}
