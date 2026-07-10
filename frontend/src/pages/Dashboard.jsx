import NavBar from "../components/NavBar.jsx";
// import RankGastos from "../components/RankGastos.jsx";
// import GraficoGastosScroll from "../components/GraficoGastosScroll.jsx";

export default function Dashboard() {
  return (
    // Aqui o bg é F0F0F7
    <div className="h-full flex flex-col justify-between bg-[#000000]">
      {/* <div className="flex flex-col p-6 mb-18">
        <div>
          <h1>Total gasto esse mês:</h1>
          <p>R$ 500,00</p>
          <h2>Saldo disponível: R$ 1.000,00</h2>
        </div>

        <div>
          <h2>Top de gastos:</h2>
          <RankGastos categoria="Mercado" value={0.5} valor={900.0} />
          <RankGastos categoria="Moto" value={0.5} valor={900.0} />
          <RankGastos categoria="Roupas" value={0.5} valor={900.0} />
          <RankGastos categoria="Fastfood" value={0.5} valor={900.0} />
          <RankGastos categoria="Gasolina" value={0.5} valor={900.0} />
        </div>

        <GraficoGastosScroll />
      </div> */}

      <NavBar />
    </div>
  );
}
