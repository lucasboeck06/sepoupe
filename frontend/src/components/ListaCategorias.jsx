import { useEffect, useState } from "react";

export default function ListarCategorias() {
  // useState entra porque a tela precisa ser recarreada para os dados do useEffect entrar
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    console.log(`${import.meta.env.VITE_API_BASE_URL}/categorias`);
    // Executa depois de o componente aparece na tela
    fetch(`${import.meta.env.VITE_API_BASE_URL}/categorias`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    }) // fetch serve para consultar rotas
      .then((res) => res.json()) // Converte a resposta para JSON
      .then((data) => setCategorias(data)); // Usa os dados
  }, []);

  return (
    <ul>
      {categorias.map(
        (
          cat, // Usa map para transformar os elementos de um array em JSX
        ) => (
          <li key={cat.id}>{cat.nome}</li>
        ),
      )}
      {/* // vira:
          // <li>alimentacao</li>
          // <li>moradia</li> */}
    </ul>
  );
}
