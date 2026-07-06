import illustration from "../assets/login-img.svg";
import { Mail, Lock } from "lucide-react";
import Input from "../components/Input.jsx";

export default function Login() {
  return (
    <div className="flex flex-col items-center h-full w-full px-12 pt-12">
      <img src={illustration} className="w-full mb-6" />
      <h1 className="mb-6">Insira os dados para logar</h1>

      <form action="submit" className="flex flex-col gap-3">
        <Input type="email" placeholder="E-mail" Icon={Mail} />
        <Input type="password" placeholder="Senha" Icon={Lock} />
        <button className="bg-[#9D9DCC] rounded-lg py-2 px-4 text-sm text-[#090933] font-medium">
          Enviar
        </button>
      </form>
    </div>
  );
}
