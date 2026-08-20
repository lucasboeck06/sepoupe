import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const usuarioLogado = localStorage.getItem("usuario-logado") === "true";

  // Se não estiver logado, redirect para o Login
  if (!usuarioLogado) {
    return <Navigate to="/" replace />;
  }

  // Se estiver logado, libera a tela, só retorna ela
  return children;
}
