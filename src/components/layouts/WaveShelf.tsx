import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomOscillators, atomOscillatorSamples } from '~/stores/context';
import WaveRack from './WaveRack';
import { randstr, round } from '~/common';
import { createControlState, createOscillatorState } from '~/generator';
import { generateOscBase } from '~/wavegen';

export default function WaveShelf() {
  const [oscillators] = useNanoState(atomOscillators);
  const [samples] = useNanoState(atomOscillatorSamples);
  const [controls] = useNanoState(atomControls);

  const onAddOscillator = async () => {
    const id = randstr();
    const controlMul = createControlState(
      `${id}-mul`, [1, 12],
      (val) => Math.trunc(val),
      1
    );
    const controlPhase = createControlState(
      `${id}-phase`,
      [0.0, 1.0],
      (val) => round(val, 2),
      0,
    );
    const controlAmp = createControlState(
      `${id}-amp`,
      [0.0, 1.0],
      (val) => round(val, 2),
      1,
    );
    const controlDuty = createControlState(
      `${id}-duty`,
      [0.0, 1.0],
      (val) => round(val, 2),
      0.5,
    );
    const controlVol = createControlState(
      `${id}-oscvol`,
      [0.0, 1.0],
      (val) => round(val, 2),
      1,
    );
    const oscillator = createOscillatorState(`${id}-osc`, {
      mul: controlMul.id,
      phase: controlPhase.id,
      amp: controlAmp.id,
      duty: controlDuty.id,
      vol: controlVol.id,
    });

    atomControls.set({
      ...controls,
      [controlMul.id]: controlMul,
      [controlPhase.id]: controlPhase,
      [controlAmp.id]: controlAmp,
      [controlDuty.id]: controlDuty,
      [controlVol.id]: controlVol,
    });
    await Promise.resolve();

    atomOscillators.set({ ...oscillators, [oscillator.id]: oscillator });
    await Promise.resolve();

    atomOscillatorSamples.set({
      ...samples,
      [oscillator.id]: generateOscBase(oscillator, {
        [controlMul.id]: controlMul,
        [controlPhase.id]: controlPhase,
        [controlAmp.id]: controlAmp,
        [controlDuty.id]: controlDuty,
        [controlVol.id]: controlVol,
      })
    });
    await Promise.resolve();
  };

  return (
    <div id="waveshelf">
      {Object.keys(oscillators).map((k) => (
        <WaveRack key={k} id={k} />
      ))}
      <button title="Add Oscillator" className="w-full py-3 flex items-center justify-center hover:bg-zinc-700 cursor-pointer" onClick={onAddOscillator}>
        <span className="text-zinc-200">(+) Oscillator</span>
      </button>
    </div>
  );
}