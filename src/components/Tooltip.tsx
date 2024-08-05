export default function Tooltip() {
  return (
    <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2">
      <div className="relative whitespace-nowrap rounded-2xl bg-purple-500 px-6 py-2 text-center text-white">FA:P 투표하러 가기!</div>
      <div className="mx-auto h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-500"></div>
    </div>
  );
}
