import { useRef } from "react";

// Precisa das chaves envolvendo os parametros!
export default function Input({ type, placeholder, Icon, value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div
      className="flex flex-row justify-center items-center gap-3 border border-[#aeaeb5] rounded-lg py-3 px-4"
      onClick={() => inputRef.current?.focus()}
    >
      <Icon className="w-4 h-4 text-[#aeaeb5] font-normal" />
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-[#aeaeb5] text-sm font-normal"
      />
    </div>
  );
}
