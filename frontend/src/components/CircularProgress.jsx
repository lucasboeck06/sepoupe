export default function CircularProgress({ porcentagem = 33 }) {
  const raio = 40;
  const circunferencia = 2 * Math.PI * raio; // Formula do perímetro: 2 * π * r

  // Calcula o quanto da linha de marcação ficará visível
  const offset = circunferencia - (porcentagem / 100) * circunferencia;

  return (
    <div className="relative flex items-center justify-center w-23 h-23">
      {/* 2. O GRÁFICO (SVG) */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Fundo cinza */}
        <circle
          cx="50"
          cy="50"
          r={raio}
          stroke="#F0F0F7"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Linha verde do progresso */}
        <circle
          cx="50"
          cy="50"
          r={raio}
          stroke="#B6B6EC"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* 3. OS TEXTOS: O "inset-0" obriga essa div a ter o mesmo tamanho da div principal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-[#161637] leading-none">
          {porcentagem}%
        </span>
        <span className="text-xs font-base text-[#aeaeb5]/70">usado</span>
      </div>
    </div>
  );
}
