import { useNanoState } from '~/hooks/useNanoState'
import { atomDialog } from '~/stores/context';

export default function Dialog() {
  const [dialog, setDialog] = useNanoState(atomDialog);

  if (!dialog) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <button role="dialog" className="fixed inset-0 bg-black/20 z-10" onClick={() => setDialog(null)}></button>
      <div className="relative z-20">
        <div className="flex flex-col border border-zinc-600 overflow-hidden" style={{ width: `${dialog.width}px` }}>
          <div className="pl-1 flex justify-between bg-zinc-600">
            <div className="mb-0.5 text-zinc-200">{dialog.title}</div>
            <div className="flex gap-x-1">
              <button className="w-8 text-zinc-200 hover:bg-zinc-500 cursor-pointer" onClick={() => setDialog(null)}>&times;</button>
            </div>
          </div>
          <div className="grow flex bg-zinc-800">
            {dialog.template}
          </div>
        </div>
      </div>
    </div>
  )
}
