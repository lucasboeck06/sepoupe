import { Home, SlidersHorizontal, BanknoteArrowUp } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const navItems = [
    { id: "detalhes", Icon: SlidersHorizontal, path: "/detalhes" },
    { id: "home", Icon: Home, path: "/dashboard" },
    { id: "transacoes", Icon: BanknoteArrowUp, path: "/transacoes" },
  ];

  return (
    <div className="w-full bottom-0 fixed flex flex-raw justify-between px-12 pt-3 pb-2 bg-[#F0F0F7] shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.06)] rounded-t-4xl z-50">
      <div className="w-full flex flex-row items-center justify-between">
        {navItems.map(({ path, Icon }) => (
          <NavLink
            to={path}
            className="h-12 flex flex-col items-center gap-1 py-2 px-3 rounded-lg"
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`z-5 w-5.5 h-5.5 ${isActive ? "text-[#6363d1]" : "text-[#b6b6ec]"}`}
                />

                {isActive && (
                  <div className="w-1 h-1 bg-[#6363d1] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
