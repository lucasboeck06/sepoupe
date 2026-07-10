import illustration from "../assets/login-img.svg";
import { Mail, Lock } from "lucide-react";
import Input from "../components/Input.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    console.log("email:", email);
    console.log("senha:", senha);

    const resposta = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email, senha }),
      },
    );

    const dados = await resposta.json();
    if (dados.token) {
      localStorage.setItem("token", dados.token);
      navigate("/dashboard");
    }
  }

  return (
    <div className="bg-[#F0F0F7] flex flex-col items-center h-full w-full px-12 pt-12">
      <img src={illustration} className="w-full mb-6" />
      <h1 className="text-[#161637] mb-6 font-medium">
        Insira os dados para logar
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="E-mail"
          Icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          Icon={Lock}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#b6b6ec] rounded-lg py-2 px-4 text-sm text-[#090933] font-normal"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
