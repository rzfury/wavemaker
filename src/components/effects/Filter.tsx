export default function Filter() {
  return (
    <div className="w-40 max-w-40 min-w-40 h-full flex flex-col border border-zinc-600">
      <div className="px-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5 text-xs text-zinc-200">Filter</div>
        <button className="mb-0.5 text-xs text-zinc-200 cursor-pointer">&times;</button>
      </div>
      <div className="grow"></div>
    </div>
  )
}
