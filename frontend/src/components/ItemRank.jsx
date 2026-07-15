export default function ItemRank({
  Icon,
  categoria,
  porcentagem,
  valor,
  corBg,
  corIco,
}) {
  return (
    <div className="relative flex items-center justify-between p-3 bg-[#F5F5F9] rounded-2xl overflow-hidden">
      <div
        className="absolute top-0 left-0 bottom-0 rounded-2xl"
        style={{ width: `${porcentagem}%`, backgroundColor: corBg }}
      />
      <div className="flex items-center gap-2 z-10">
        <Icon className="w-4 h-4" color={corIco} />
        <span className="text-sm font-semibold text-[#3A3248]">
          {categoria}
        </span>
      </div>
      <div className="flex items-center gap-2 z-10">
        <span className="text-sm font-semibold" style={{ color: corIco }}>
          {porcentagem}%
        </span>
        <span className="text-sm text-[#9B93A8]">R${valor}</span>
      </div>
    </div>
  );
}
