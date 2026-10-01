export async function api(rota, metodo, corpo) {
  const resposta = await fetch(`${import.meta.env.VITE_API_BASE_URL}${rota}`, {
    method: metodo,
    credentials: "include",
    ...(metodo !== "GET" && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    }),
  });

  if (resposta.status === 401) {
    localStorage.removeItem("usuario-logado");
    window.location.href = "/";
    return;
  }

  if (!resposta.ok) {
    const erroDados = await resposta.json().catch(() => ({}));

    const mensagemDoBack = erroDados.err || "Erro desconhecido no servidor!";

    alert(`Erro: ${mensagemDoBack}`);
    throw new Error(mensagemDoBack);
  }

  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}
