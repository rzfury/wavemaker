import { clamp, SAMPLE_RATE } from '~/common';
import { useDialog } from '~/hooks/useDialog';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomEffects, getControl, getOscillator } from '~/stores/context';
import { generateOscMix } from '~/wavegen';
import Control from '../common/Control';
import WaveRender from '../common/WaveRender';
import AddEffectDialog from '../dialogs/AddEffectDialog';
import OscOutRouteDialog from '../dialogs/OscOutRouteDialog';
import Oscillator from '../oscillators/Oscillator';
import Gain from '../effects/Gain';
import ReversePolarity from '../effects/ReversePolarity';
import Delay from '../effects/Delay';
// import Filter from '../effects/Filter';

export default function WaveRack({ id }: { id: string }) {
  const dialog = useDialog();

  const [controls] = useNanoState(atomControls);
  const [effects] = useNanoState(atomEffects);

  const osc = getOscillator(id);
  const vol = getControl(osc.controls.vol);

  const onAddEffect = () => {
    dialog.open({
      title: 'Add Effect',
      template: <AddEffectDialog oscId={osc.id} />,
      width: 560,
    });
  }

  const openModalChangeOutputRoute = () => {
    dialog.open({
      title: 'Change Output Route',
      template: <OscOutRouteDialog oscId={osc.id}/>,
      width: 320,
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
        {Object.entries(effects).filter(([_, fx]) => osc.id === fx.oscillator).map(([_, fx]) => {
          if (fx.type === 'gain') return <Gain id={fx.id}/>
          if (fx.type === 'reverse') return <ReversePolarity id={fx.id}/>
          if (fx.type === 'delay') return <Delay id={fx.id}/>
          // if (fx.type === 'filter') return <Filter id={fx.id}/>
          return null;
        })}
        <button title="Add Effect" className="w-8 max-w-8 min-w-8 h-full flex items-center justify-center hover:bg-zinc-700 cursor-pointer" onClick={onAddEffect}>
          <span className="text-zinc-200">(+)<span className="text-upright">&nbsp;FX</span></span>
        </button>
      </div>
      <div className="w-[200px] min-w-[200px] max-w-[200px] flex flex-col">
        <WaveRender samples={generateOscMix(SAMPLE_RATE, osc, controls, effects)} />
        <Control id={osc.controls.vol}>
          {(control, onChange) => (
            <div className="px-2 py-1">
              <input type="range" min={control.rangeMin} max={control.rangeMax} step={0.01} value={clamp(vol.value, control.rangeMin, control.rangeMax)} className="block w-full py-1" onInput={(e: any) => onChange(e.target.valueAsNumber)} />
            </div>
          )}
        </Control>
        <button className="px-2 py-1 flex items-center justify-between hover:bg-zinc-700 text-xs text-zinc-200 cursor-pointer" onClick={openModalChangeOutputRoute}>
          <div className="">ROUTE:</div>
          <div className="">{osc.route.toUpperCase()}</div>
        </button>
      </div>
    </div>
  )
}
