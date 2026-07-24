import NavBar from "../components/NavBar.jsx";
import { CircleArrowDown, CircleArrowUp, CircleAlert } from "lucide-react";

export default function Pendentes() {
  return (
    <div>
      <div className="p-5">
        <div className="flex justify-between">
          <h1>Transacoes</h1>
          <span>Julho 2026</span>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="flex">
              <CircleArrowUp />
              <h2>Entradas</h2>
            </div>
            <span>R$ 2.0000</span>
          </div>
          <div>
            <div className="flex">
              <CircleArrowDown />
              Saídas
            </div>
            <span>R$ 1.000</span>
          </div>
        </div>
        <div className="flex">
          <CircleAlert />
          <h3>4 Transações sem categoria</h3>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
