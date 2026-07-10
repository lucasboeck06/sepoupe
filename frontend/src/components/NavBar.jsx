import { Home, SlidersHorizontal, ListChecks } from "lucide-react";

export default function NavBar() {
  return (
    <div className="w-full bottom-0 fixed flex flex-raw justify-between px-10 py-4 bg-[#F0F0F7] shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.03)]">
      <SlidersHorizontal />
      <Home />
      <ListChecks />
    </div>
  );
}
