// Aqui é Header, não { Header }, porque o componente é default, não named
import Header from "./components/Header.jsx";
import Contador from "./components/Contador.jsx";
import ListarCategorias from "./components/ListaCategorias.jsx";

export default function App() {
  // Mesmo sendo uma função, chamamos ele como componente
  // nome, é uma prop, que passamos para a func/componente
  return (
    <div>
      <Header nome="Lucas" />
      <Contador />
      <ListarCategorias />
    </div>
  );
}
