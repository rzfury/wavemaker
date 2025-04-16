import { useNanoState } from '~/hooks/useNanoState';
import { atomEffects } from '~/stores/context';

export default function ReversePolarity({ id }: { id: string }) {
  const [effects, setEffects] = useNanoState(atomEffects);
  const fx = effects[id];

  const onToggleBypass = () => {
    const fxCopy = { ...fx };
    fxCopy.bypass = !fxCopy.bypass;
    setEffects({ ...effects, [fxCopy.id]: fxCopy });    
  }

  const onRemoveFX = () => {
    setEffects(Object.fromEntries(Object.entries(effects).filter(([k]) => k !== id)));
  }

  return (
    <div className="h-full flex flex-col border border-zinc-600 text-xs text-zinc-200">
      <div className="pl-1 flex gap-x-4 justify-between bg-zinc-600">
        <div className="mb-0.5 whitespace-nowrap">Reverse Polarity</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onToggleBypass}>{fx.bypass ? 'T' : 'B'}</button>
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveFX}>&times;</button>
        </div>
      </div>
      <div className="grow flex items-center justify-center">
        
      </div>
    </div>
  )
}
