export default function formatarMesExibicao(mesString) {
  const [ano, mes] = mesString.split("-").map(Number);
  const data = new Date(ano, mes - 1, 1);
  const texto = data.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
