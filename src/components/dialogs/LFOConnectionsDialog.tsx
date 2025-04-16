import { useStore } from '@nanostores/react';
import { atomControls, atomLFOs } from '~/stores/context';

export default function LFOConnectionsDialog(
  { lfo }: { lfo: LFOState }
) {
  const lfos = useStore(atomLFOs);
  const controls = useStore(atomControls);

  const onToggleDirection = (controlId: string) => {
    const lfoCopy = { ...lfo };
    const controlIndex = lfo.controls.findIndex(v => v.id === controlId);
    if (controlIndex >= 0) {
      lfo.controls[controlIndex].direction = lfo.controls[controlIndex].direction === 'forward' ? 'backward' : 'forward';
    }
    atomLFOs.set({ ...lfos, [lfoCopy.id]: lfoCopy });
  }

  return (
    <div className="w-full p-4 text-zinc-200">
      {lfo.controls.map((control) => (
        <div key={control.id} className="flex items-center gap-x-12">
          <div className="w-22 whitespace-nowrap">{control.id}</div>
          <div className="grow">
            <input type="range" className="block w-full" value={controls[control.id].value} min={controls[control.id].rangeMin} max={controls[control.id].rangeMax} readOnly/>
          </div>
          <button className="w-40 shrink block py-1 bg-zinc-700 hover:bg-zinc-600" onClick={() => onToggleDirection(control.id)}>{control.direction.toUpperCase()}</button>
        </div>
      ))}
    </div>
  );
}
