import ItemRank from "./ItemRank.jsx";
import { House } from "lucide-react";

export default function RankGastos() {
  const topGastos = [
    {
      id: 1,
      categoria: "Moradia",
      porcentagem: 31,
      valor: 1400,
      Icon: House,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
  ];

  return (
    <div>
      {topGastos.map((n) => (
        <ItemRank
          key={n.id}
          Icon={n.Icon}
          categoria={n.categoria}
          porcentagem={n.porcentagem}
          valor={n.valor}
          corBg={n.corBg}
          corIco={n.corIco}
        />
      ))}
    </div>
  );
}
