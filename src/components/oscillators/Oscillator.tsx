import { useState } from 'react';
import { useDialog } from '~/hooks/useDialog';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomOscillators } from '~/stores/context';
import { generateOscBase } from '~/wavegen';
import { clamp, SAMPLE_RATE } from '../../common';
import Control from '../common/Control';
import WaveRender from '../common/WaveRender';
import ConnectLFODialog from '../dialogs/ConnectLFODialog';

export default function Oscillator({ id }: { id: string }) {

  const dialog = useDialog();

  const [oscillators] = useNanoState(atomOscillators);
  const [controls] = useNanoState(atomControls);

  const oscillator = oscillators[id];

  const [wave, setWave] = useState<string>('sine');

  const onChangeWave = (e: any) => {
    const wave = e.target.value;

    switch (wave) {
      case 'sine':
      case 'pulse':
      case 'triangle':
      case 'saw':
      case 'noise':
      case 'noise-const': {
        atomOscillators.set({ ...oscillators, [oscillator.id]: { ...oscillator, wave } });
        setWave(wave);
        return;
      }
      default: return;
    }
  }

  const openModalConnectLFO = (controlId: string) => {
    dialog.open({
      title: 'Connect Control to LFO',
      template: <ConnectLFODialog controlId={controlId} />,
      width: 720
    });
  }

  const onRemoveOscillator = () => {
    atomOscillators.set(Object.fromEntries(Object.entries(oscillators).filter(([k]) => k !== oscillator.id)));
  };

  return (
    <div className="w-[520px] min-w-[520px] h-full flex flex-col border border-zinc-600 overflow-hidden">
      <div className="pl-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5 text-xs text-zinc-200">Oscillator [{oscillator.id}]</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 text-xs text-zinc-200 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveOscillator}>&times;</button>
        </div>
      </div>
      <div className="grow flex bg-zinc-700">
        <div className="w-[280px] h-full">
          <WaveRender samples={generateOscBase(SAMPLE_RATE, oscillator, controls)} />
        </div>
        <div className="grow pl-2">
          <div className="flex items-center justify-between gap-x-2">
            <div className="w-16 text-xs text-white">WAVE</div>
            <select className="px-2 py-1 w-full text-xs text-white cursor-pointer" onInput={onChangeWave}>
              <option className="text-black" value="sine">Sine</option>
              <option className="text-black" value="saw">Saw</option>
              <option className="text-black" value="triangle">Triangle</option>
              <option className="text-black" value="pulse">Pulse</option>
              {/* <option className="text-black" value="noise">Noise</option> */}
              {/* <option className="text-black" value="noise-const">Noise Constants</option> */}
            </select>
          </div>
          <Control id={oscillator.controls.mul}>
            {(control, onChange) => (
              <div className="flex items-center justify-between gap-x-2">
                <div className="w-12 text-xs text-white" title={`ID [${control.id}]`}>MUL</div>
                <input type="range" className="block w-32" min={control.rangeMin} max={control.rangeMax} step={1} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
                <div className="w-6 text-xs text-white">{Math.trunc(clamp(control.value, control.rangeMin, control.rangeMax))}</div>
                <button className="px-2 py-1 w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
              </div>
            )}
          </Control>
          <Control id={oscillator.controls.phase}>
            {(control, onChange) => (
              <div className="flex items-center justify-between gap-x-2">
                <div className="w-12 text-xs text-white" title={`ID [${control.id}]`}>PHS</div>
                <input type="range" className="block w-32" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
                <div className="w-6 text-xs text-white">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
                <button className="px-2 py-1 w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
              </div>
            )}
          </Control>
          <Control id={oscillator.controls.amp}>
            {(control, onChange) => (
              <div className="flex items-center justify-between gap-x-2">
                <div className="w-12 text-xs text-white" title={`ID [${control.id}]`}>AMP</div>
                <input type="range" className="block w-32" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
                <div className="w-6 text-xs text-white">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
                <button className="px-2 py-1 w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
              </div>
            )}
          </Control>
          {wave === 'pulse' && (
            <Control id={oscillator.controls.duty}>
              {(control, onChange) => (
                <div className="flex items-center justify-between gap-x-2">
                  <div className="w-12 text-xs text-white" title={`ID [${control.id}]`}>DUTY</div>
                  <input type="range" className="block w-32" min={control.rangeMin} max={control.rangeMax} step={0.01} onInput={(e: any) => onChange(e.target.valueAsNumber)} value={control.value} disabled={!!control.lfo} />
                  <div className="w-6 text-xs text-white">{clamp(control.value, control.rangeMin, control.rangeMax)}</div>
                  <button className="px-2 py-1 w-6 text-xs text-white hover:bg-zinc-600" onClick={() => openModalConnectLFO(control.id)}>{control.lfo ? 'L' : 'C'}</button>
                </div>
              )}
            </Control>
          )}
        </div>
      </div>
    </div>
  )
}