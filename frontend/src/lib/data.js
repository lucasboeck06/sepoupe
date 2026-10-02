export default function hojeLocal() {
  const data = new Date();

  // gets trazem os números da data
  // String transforma para string
  // padStart garante que se não tiver duas casas, a primeira é 0
  const ano = String(data.getFullYear());
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
