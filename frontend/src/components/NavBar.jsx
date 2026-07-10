import { useState } from "react";
import { Home, SlidersHorizontal, ListChecks } from "lucide-react";

export default function NavBar() {
  const [abaAtiva, setAbaAtiva] = useState("home");

  const navItems = [
    { id: "detalhes", Icon: SlidersHorizontal },
    { id: "home", Icon: Home },
    { id: "transacoes", Icon: ListChecks },
  ];

  return (
    <div className="w-full bottom-0 fixed flex flex-raw justify-between px-12 pt-3 pb-2 bg-[#F0F0F7] shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.06)] rounded-t-4xl">
      <div className="w-full flex flex-row items-center justify-between">
        {navItems.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            className="h-12 flex flex-col items-center gap-1 py-2 px-3 rounded-lg"
          >
            <Icon
              className={`z-5 w-5.5 h-5.5 ${abaAtiva === id ? "text-[#6363d1]" : "text-[#b6b6ec]"}`}
            />

            {abaAtiva === id && (
              <div className="w-1 h-1 bg-[#6363d1] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
