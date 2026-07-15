import ItemRank from "./ItemRank.jsx";
import {
  Hamburger,
  House,
  Flame,
  Motorbike,
  Gift,
  GraduationCap,
  Building2,
  Zap,
  Bubbles,
  Popcorn,
} from "lucide-react";

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
    {
      id: 2,
      categoria: "Lazer",
      porcentagem: 24,
      valor: 389,
      Icon: Popcorn,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 3,
      categoria: "Água",
      porcentagem: 9,
      valor: 82,
      Icon: Bubbles,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 4,
      categoria: "Luz",
      porcentagem: 11,
      valor: 93,
      Icon: Zap,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 5,
      categoria: "Condomínio",
      porcentagem: 13,
      valor: 201,
      Icon: Building2,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 6,
      categoria: "Educação",
      porcentagem: 0,
      valor: 0,
      Icon: GraduationCap,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 7,
      categoria: "Presentes",
      porcentagem: 8,
      valor: 140,
      Icon: Gift,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 8,
      categoria: "Moto",
      porcentagem: 2,
      valor: 11,
      Icon: Motorbike,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 9,
      categoria: "Gás",
      porcentagem: 8,
      valor: 98,
      Icon: Flame,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
    {
      id: 10,
      categoria: "FastFood",
      porcentagem: 19,
      valor: 334,
      Icon: Hamburger,
      corBg: "#ece6f7",
      corIco: "#8b7bc7",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
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
