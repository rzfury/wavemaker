import { useStore } from '@nanostores/react';
import { useDialog } from '~/hooks/useDialog';
import { atomControls, atomLFOs, getControl } from '~/stores/context';

export default function ConnectLFODialog({ controlId }: { controlId: string }) {
  const dialog = useDialog();
  const control = getControl(controlId);

  const controls = useStore(atomControls);
  const lfos = useStore(atomLFOs);

  const onConnectLFO = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'none') {
      const controlCopy = { ...controls[controlId] };
      const lfoCopy = { ...lfos[controlCopy.lfo!] };

      controlCopy.lfo = null;
      lfoCopy.controls = lfoCopy.controls.filter(v => v.id !== controlId);
    
      atomControls.set({ ...controls, [controlId]: controlCopy });
      atomLFOs.set({ ...lfos, [lfoCopy.id]: lfoCopy });
    }
    else {
      const controlCopy = { ...controls[controlId] };
      const lfoCopy = { ...lfos[e.target.value] };

      controlCopy.lfo = e.target.value;
      lfoCopy.controls.push({ id: controlId, bypass: false });
    
      atomControls.set({ ...controls, [controlId]: controlCopy });
      atomLFOs.set({ ...lfos, [lfoCopy.id]: lfoCopy });
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-y-4 p-4 text-zinc-200">
      <div className="w-full flex items-center justify-between">
        <div className="w-16">LFO</div>
        <select className="grow" onChange={onConnectLFO} value={control.lfo || 'none'}>
          <option className="text-zinc-900" value="none">None</option>
          {Object.entries(lfos).map(([_, lfo]) => (
            <option key={lfo.id} className="text-zinc-900" value={lfo.id}>LFO {lfo.id}</option>
          ))}
        </select>
      </div>
      <div>--- INTO ---</div>
      <div className="w-full flex items-center justify-between">
        <div className="w-16">CONTROL</div>
        <div className="grow text-right"><code>{control.id}</code></div>
      </div>
      <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600" onClick={dialog.close}>CLOSE</button>
    </div>
  );
}
