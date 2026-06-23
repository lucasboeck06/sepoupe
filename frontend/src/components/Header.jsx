// nome é o parametro para exibição do texto
export default function Header({ nome }) {
  return (
    <div>
      <h1>Financeiro pessoal</h1>
      {/* Define onde o parametro passado irá aparecer */}
      <h2>Bem-vindo {nome}!</h2>
    </div>
  );
}
