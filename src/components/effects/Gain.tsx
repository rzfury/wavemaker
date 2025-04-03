export default function Gain() {
  return (
    <div className="w-24 max-w-24 min-w-24 h-full flex flex-col border border-zinc-600 text-xs text-zinc-200">
      <div className="pl-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5">Gain</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer">B</button>
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer">&times;</button>
        </div>
      </div>
      <div className="grow flex flex-col items-center">
        <div className="px-4 py-3">
          <input type="range" className="w-4 h-30 vrl"/>
        </div>
        <div className="text-xs text-z">
          0%
        </div>
      </div>
    </div>
  )
}
