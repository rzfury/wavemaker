import { clamp } from '~/common';
import { useDialog } from '~/hooks/useDialog';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomEffects, atomOscillators, getControl, getOscillator } from '~/stores/context';
import { generateOscMix } from '~/wavegen';
import WaveRender from '../common/WaveRender';
import AddEffectDialog from '../dialogs/AddEffectDialog';
import Gain from '../effects/Gain';
import Oscillator from '../oscillators/Oscillator';

export default function WaveRack({ id }: { id: string }) {
  const VOL_MAX = 1.0;
  const VOL_MIN = 0.0;

  const dialog = useDialog();

  const [oscillators] = useNanoState(atomOscillators);
  const [controls] = useNanoState(atomControls);
  const [effects] = useNanoState(atomEffects);

  const osc = getOscillator(id);
  const vol = getControl(osc.controls.vol);

  const onVolChange = (e: any) => {
    atomControls.set({ ...controls, [osc.controls.vol]: { ...vol, value: clamp(e.target.valueAsNumber, VOL_MIN, VOL_MAX) } });
  }

  const onAddEffect = () => {
    dialog.open({
      title: 'Add Effect',
      template: <AddEffectDialog />,
      width: 420,
    });
  }

  if (!(osc
    && controls[osc.controls.mul]
    && controls[osc.controls.phase]
    && controls[osc.controls.amp]
    && controls[osc.controls.duty]
    && controls[osc.controls.vol]
  )) {
    return (<div className="text-white">Loading...</div>);
  }

  return (
    <div className="h-[208px] min-h-[208px] max-h-[208px] flex gap-x-4 bg-zinc-800 border border-zinc-800 shadow-md shadow-black/50">
      <div className="flex grow p-2 gap-x-4 overflow-x-auto">
        <Oscillator id={id} />
        <Gain />
        <button title="Add Effect" className="w-8 max-w-8 min-w-8 h-full flex items-center justify-center hover:bg-zinc-700 cursor-pointer" onClick={onAddEffect}>
          <span className="text-zinc-200">(+)<span className="text-upright">&nbsp;FX</span></span>
        </button>
      </div>
      <div className="w-[200px] min-w-[200px] max-w-[200px] flex flex-col">
        <WaveRender samples={generateOscMix(osc, controls, effects)} />
        <div className="px-2 py-1">
          <input type="range" min={0.0} max={1.0} step={0.01} value={clamp(vol.value, VOL_MIN, VOL_MAX)} className="block w-full py-1" onInput={onVolChange} />
        </div>
        <button className="px-2 py-1 flex items-center justify-between hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer">
          <div className="">ROUTE:</div>
          <div className="">MASTER</div>
        </button>
      </div>
    </div>
  )
}
