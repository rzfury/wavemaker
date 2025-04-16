import { atomControls, atomEffects } from '~/stores/context';
import ConnectLFODialog from '../dialogs/ConnectLFODialog';
import { useStore } from '@nanostores/react';
import { useNanoState } from '~/hooks/useNanoState';
import { useDialog } from '~/hooks/useDialog';
import Control from '../common/Control';
import { logRange } from '~/common';

export default function Filter({ id }: { id: string }) {
  const dialog = useDialog();

  const [effects, setEffects] = useNanoState(atomEffects);
  const fx = effects[id];

  const controls = useStore(atomControls);
  const cutoff = controls[fx.controls['cutoff']];

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
    <div className="w-32 max-w-32 min-w-32 h-full flex flex-col border border-zinc-600 text-xs text-zinc-200">
      <div className="px-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5">Filter 1</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onToggleBypass}>{fx.bypass ? 'T' : 'B'}</button>
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveFX}>&times;</button>
        </div>
      </div>
      <div className="grow flex flex-col items-center">
        <Control id={effects[id].controls['cutoff']} className="px-4 py-3">
          {(control, onChange) => (
            <input
              type="range"
              className="w-4 h-30 vrl"
              min={control.rangeMin}
              max={control.rangeMax}
              step={0.001}
              value={control.value}
              onChange={(e: any) => onChange(e.target.valueAsNumber)}
            />
          )}
        </Control>
        <div className="flex gap-x-2">
          <div className="text-xs text-zinc-200">
            {logRange(cutoff.value, 20, 20000).toFixed(0)} hz
          </div>
          <button className="w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(cutoff.id)}>{cutoff.lfo ? 'L' : 'C'}</button>
        </div>
      </div>
    </div>
  )
}
