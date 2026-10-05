export async function api(rota, metodo, corpo) {
  const resposta = await fetch(`${import.meta.env.VITE_API_BASE_URL}${rota}`, {
    method: metodo,
    credentials: "include",
    ...(corpo !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    }),
  });

  // No login, 401 é credencial errada, não sessão expirada
  if (resposta.status === 401 && rota !== "/auth/login") {
    localStorage.removeItem("usuario-logado");
    window.location.href = "/";
    throw new Error("Sessão expirada!");
  }

  if (!resposta.ok) {
    const erroDados = await resposta.json().catch(() => ({}));

    const mensagemDoBack = erroDados.erro || "Erro desconhecido no servidor!";

    alert(`Erro: ${mensagemDoBack}`);
    throw new Error(mensagemDoBack);
  }

  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}
