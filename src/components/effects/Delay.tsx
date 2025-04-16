import { useStore } from '@nanostores/react';
import { Fragment } from 'react';
import { clamp } from '~/common';
import { useDialog } from '~/hooks/useDialog';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomEffects } from '~/stores/context';
import Control from '../common/Control';
import ConnectLFODialog from '../dialogs/ConnectLFODialog';

export default function Delay({ id }: { id: string }) {
  const dialog = useDialog();

  const [effects, setEffects] = useNanoState(atomEffects);
  const fx = effects[id];

  const controls = useStore(atomControls);

  const delaytime = controls[effects[id].controls['delaytime']];
  const feedback = controls[effects[id].controls['feedback']];
  const mix = controls[effects[id].controls['mix']];

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
    <div className="h-full flex flex-col border border-zinc-600 text-xs text-zinc-200">
      <div className="pl-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5">Delay</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onToggleBypass}>{fx.bypass ? 'T' : 'B'}</button>
          <button className="mb-0.5 w-4 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveFX}>&times;</button>
        </div>
      </div>
      <div className="grow flex items-center gap-x-4 px-2 text-zinc-200">
        <Control id={delaytime.id} className="flex flex-col items-center justify-between gap-y-1">
          {(control, onChange) => (
            <Fragment>
              <div className="text-xs" title={`ID [${control.id}]`}>DT</div>
              <input type="range" className="block h-24 vrl" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
              <div className="text-xs w-6 text-center">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
              <button className="px-2 py-1 w-6 text-xs hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
            </Fragment>
          )}
        </Control>
        <Control id={feedback.id} className="flex flex-col items-center justify-between gap-y-1">
          {(control, onChange) => (
            <Fragment>
              <div className="text-xs" title={`ID [${control.id}]`}>FB</div>
              <input type="range" className="block h-24 vrl" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
              <div className="text-xs w-6 text-center">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
              <button className="px-2 py-1 w-6 text-xs hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
            </Fragment>
          )}
        </Control>
        <Control id={mix.id} className="flex flex-col items-center justify-between gap-y-1">
          {(control, onChange) => (
            <Fragment>
              <div className="text-xs" title={`ID [${control.id}]`}>MIX</div>
              <input type="range" className="block h-24 vrl" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
              <div className="text-xs w-6 text-center">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
              <button className="px-2 py-1 w-6 text-xs hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
            </Fragment>
          )}
        </Control>
      </div>
    </div>
  )
}
