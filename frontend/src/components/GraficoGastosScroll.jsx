import { AreaChart, Area, XAxis, Tooltip, LabelList } from "recharts";

// Mock de dados simulando o mês cheio para testar o scroll
const dadosTrintaDias = Array.from({ length: 30 }, (_, i) => {
  const dia = String(i + 1).padStart(2, "0");
  // Simulando alguns dias com gasto zero e outros com picos
  const gasto = i % 5 === 0 ? Math.floor(Math.random() * 200) + 20 : 0;
  return { dia, gasto };
});

export default function GraficoGastosScroll() {
  return (
    <div className="w-full bg-[#F0F0F7] rounded-xl">
      <h3 className="text-[#161637] font-bold mb-4">
        Gasto diário no mês de Julho
      </h3>

      {/* CONTAINER DO SCROLL: 
        A classe 'overflow-x-auto' ativa o scroll horizontal.
        As classes com [&::-webkit-scrollbar] escondem a barra de scroll nativa do sistema,
        deixando o visual muito mais limpo. O usuário só precisa arrastar.
      */}
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* LARGURA FIXA: 
          Forçamos uma div interna a ter 1200px de largura. 
          Isso garante que o gráfico estique para o lado e ative o scroll da div pai.
        */}
        <div className="w-[1200px] h-64">
          {/* Aqui não usamos o ResponsiveContainer, passamos a largura fixa direto no AreaChart */}
          <AreaChart
            width={1200}
            height={220}
            data={dadosTrintaDias}
            margin={{ top: 25, right: 20, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="corLavanda" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B6B6EC" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#B6B6EC" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Eixo X mostrando TODOS os dias, sem pular nenhum */}
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#575799", fontWeight: "500" }}
              dy={10}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="gasto"
              stroke="#6363D1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#corLavanda)"
            >
              {/* VALORES EM CIMA DOS PONTOS:
                O LabelList projeta o valor de cada dia direto no gráfico.
                Usamos um formatter para mostrar o valor zerado como vazio "",
                assim a tela não fica poluída nos dias que o usuário não gastou nada.
              */}
              <LabelList
                dataKey="gasto"
                position="top"
                offset={10}
                fill="#161637"
                fontSize={10}
                fontWeight="700"
                formatter={(value) => (value > 0 ? `R$ ${value}` : "")}
              />
            </Area>
          </AreaChart>
        </div>
      </div>

      {/* Um pequeno aviso sutil para o usuário saber que dá para arrastar */}
      <p className="text-center text-[10px] text-[#575799] mt-2 animate-pulse">
        ← Arraste para o lado para ver o mês completo →
      </p>
    </div>
  );
}
