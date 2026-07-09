export default function RankGastos({ value, categoria, valor }) {
  return (
    <div>
      <h3>
        {categoria}: R$ {valor}
      </h3>
      <progress
        value={value}
        className="w-full h-4 appearance-none rounded-full [&::-webkit-progress-bar]:bg-[#E1E1F7] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-[#B6B6EC] [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-[#B6B6EC]"
      />
    </div>
  );
}
