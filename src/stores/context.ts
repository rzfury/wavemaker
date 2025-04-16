import { atom, computed } from 'nanostores';
import { SAMPLE_RATE } from '~/common';
import { generateMasterMix } from '~/wavegen';

export const atomTimeFrame = atom<number>(0);

export const atomOscillators = atom<{ [key: string]: OscillatorState }>({});
export const atomOscillatorSamples = atom<{ [key: string]: number[] }>({});
export const atomOscillatorSamplesSum = atom<number[]>([]);

export const atomEffects = atom<{ [key: string]: EffectState }>({});

export const atomControls = atom<{ [key: string]: ControlState }>({});

export const atomLFOs = atom<{ [key: string]: LFOState }>({});

export const getOscillator = (id: string) => atomOscillators.get()[id];
export const getOscSamples = (id: string) => atomOscillatorSamples.get()[id];

export const getLFO = (id: string) => atomLFOs.get()[id];

export const getMasterMix = computed([atomOscillators, atomControls, atomEffects], (oscs, controls, effects) => {
  return generateMasterMix(SAMPLE_RATE, oscs, controls, effects);
});

export const getMasterMixF32 = computed([getMasterMix], (from) => {
  const samples = new Float32Array(SAMPLE_RATE);
  from.forEach((n, i) => { samples[i] = n; });
  return samples;
});

export const getControl = (id: string) => atomControls.get()[id];

// DOM

export const atomDialog = atom<{
  title: string,
  template: React.ReactNode,
  width: number,
} | null>(null);
