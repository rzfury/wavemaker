import { useStore } from '@nanostores/react';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomEffects } from '~/stores/context'
import Control from '../common/Control';
import { useDialog } from '~/hooks/useDialog';
import ConnectLFODialog from '../dialogs/ConnectLFODialog';

export default function Gain({ id }: { id: string }) {
  const dialog = useDialog();

  const [effects, setEffects] = useNanoState(atomEffects);
  const fx = effects[id];

  const controls = useStore(atomControls);

  const gain = controls[effects[id].controls['gain']];

  const openModalConnectLFO = (controlId: string) => {
    dialog.open({
      title: 'Connect Control to LFO',
      template: <ConnectLFODialog controlId={controlId} />,
      width: 720
    });
  }

  const onToggleBypass = () => {
    const fxCopy = { ...fx };
    fxCopy.bypass = !fxCopy.bypass;
    setEffects({ ...effects, [fxCopy.id]: fxCopy });
  }

  const onRemoveFX = () => {
    setEffects(Object.fromEntries(Object.entries(effects).filter(([k]) => k !== id)));
  }

  return (
    <div className="w-24 max-w-24 min-w-24 h-full flex flex-col border border-zinc-600 text-xs text-zinc-200">
      <div className="pl-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5">Gain</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onToggleBypass}>{fx.bypass ? 'T' : 'B'}</button>
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveFX}>&times;</button>
        </div>
      </div>
      <div className="grow flex flex-col items-center">
        <Control id={effects[id].controls['gain']} className="px-4 py-3">
          {(control, onChange) => (
            <input
              type="range"
              className="w-4 h-30 vrl"
              min={control.rangeMin}
              max={control.rangeMax}
              step={0.01}
              value={control.value}
              onChange={(e: any) => onChange(e.target.valueAsNumber)}
            />
          )}
        </Control>
        <div className="flex gap-x-2">
          <div className="text-xs text-z">
            {Math.round(gain.value * 100)}%
          </div>
          <button className="w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(gain.id)}>{gain.lfo ? 'L' : 'C'}</button>
        </div>
      </div>
    </div>
  )
}
