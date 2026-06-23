// importa o useState do React — sem isso não funciona
import { useState } from "react";

// declara o componente — função que retorna JSX
export default function Contador() {
  // cria um estado chamado "count" com valor inicial 0
  // count    → valor atual (começa em 0)
  // setCount → função que atualiza o count e redesenha a tela
  const [count, setCount] = useState(0);

  // retorna o HTML que aparece na tela
  return (
    <div>
      {/* mostra o valor atual de count — {} executa JS dentro do JSX */}
      <p>Cliques: {count}</p>

      {/* quando clicar, executa a arrow function */}
      {/* a arrow function chama setCount com o valor atual + 1 */}
      {/* setCount avisa o React: "mudou, redesenha" */}
      <button onClick={() => setCount(count + 1)}> Clique aqui!</button>
    </div>
  );
}
