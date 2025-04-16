import { clamp, logRange, mapRange, TOTAL_FRAME_COUNT } from './common';
import { atomControls, atomEffects, atomLFOs, atomOscillators } from './stores/context';

export function calculateSine(time: number, mul: number, phase: number, amp: number) {
  return amp * Math.sin(2 * Math.PI * time * mul + (2 * Math.PI * phase));
}

export function calculateSaw(time: number, mul: number, phase: number, amp: number) {
  return amp * (2 * ((time * mul + phase + 0.5) % 1) - 1);
}

export function calculateTriangle(time: number, mul: number, phase: number, amp: number) {
  return amp * (2 * (Math.acos(Math.cos(2 * time * mul * Math.PI + (Math.PI * 0.5) + (2 * Math.PI * phase))) / Math.PI) - 1);
}

export function calculatePulse(time: number, mul: number, phase: number, amp: number, duty: number) {
  return amp * (((time * mul + (2 * Math.PI * phase) / (2 * Math.PI)) % 1 < duty) ? -1 : 1);
}

export function generateOscBase(sampleRate: number, osc: OscillatorState, controls: { [key: string]: ControlState }) {
  if (osc.wave === 'sine') {
    return Array.from({ length: sampleRate }, (_, i) => {
      const t = i / sampleRate;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateSine(t, mul, phase, amp);
    });
  }

  if (osc.wave === 'pulse') {
    return Array.from({ length: sampleRate }, (_, i) => {
      const t = i / sampleRate;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      const duty = controls[osc.controls.duty].value;
      return calculatePulse(t, mul, phase, amp, duty);
    });
  }

  if (osc.wave === 'saw') {
    return Array.from({ length: sampleRate }, (_, i) => {
      const t = i / sampleRate;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateSaw(t, mul, phase, amp);
    });
  }

  if (osc.wave === 'triangle') {
    return Array.from({ length: sampleRate }, (_, i) => {
      const t = i / sampleRate;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateTriangle(t, mul, phase, amp);
    });
  }

  return [];
}

export function generateOscMix(
  sampleRate: number,
  oscillator: OscillatorState,
  controls: { [key: string]: ControlState },
  effects: { [key: string]: EffectState },
) {
  let samples = generateOscBase(sampleRate, oscillator, controls);

  Object.entries(effects).forEach(([_, fx]) => {
    if (fx.oscillator !== oscillator.id) return;
    if (fx.bypass) return;

    if (fx.type === 'reverse') {
      samples = samples.map((sample) => sample * -1);
      return;
    }

    if (fx.type === 'gain') {
      if (!controls[fx.controls['gain']]) return;
      const gain = controls[fx.controls['gain']];
      samples = samples.map((sample) => sample * gain.value);
      return;
    }

    if (fx.type === 'delay') {
      if (!controls[fx.controls['delaytime']]
        || !controls[fx.controls['feedback']]
        || !controls[fx.controls['mix']]
      ) return;
      const delayTime = controls[fx.controls['delaytime']];
      const feedback = controls[fx.controls['feedback']];
      const mix = controls[fx.controls['mix']];

      const delaySamples = Math.floor(sampleRate * delayTime.value);

      for (let i = delaySamples; i < samples.length; i++) {
        const delayedSamples = samples[i - delaySamples] * feedback.value;
        samples[i] = samples[i] * (1 - mix.value) + delayedSamples * mix.value;
      }

      return;
    }

    if (fx.type === 'filter-1') {
      if (!controls[fx.controls['cutoff']]) return;
      const cutoff = controls[fx.controls['cutoff']];

      const freq = logRange(cutoff.value, 20, 20000);
      const RC = 1.0 / (2 * Math.PI * freq);
      const dt = 1.0 / sampleRate;
      const alpha = dt / (RC + dt);

      for (let i = 1; i < samples.length; i++) {
        const currentSample = samples[i];
        const prevSample = samples[i - 1];
        samples[i] = prevSample + alpha * (currentSample - prevSample);
      }

      return;
    }
  });

  samples = samples.map((v) => v * controls[oscillator.controls.vol].value);

  return samples;
}

export function generateMasterMix(
  sampleRate: number,
  oscillators: { [key: string]: OscillatorState },
  controls: { [key: string]: ControlState },
  effects: { [key: string]: EffectState },
) {  
  const samples = Array.from<number>({ length: sampleRate }).fill(0);

  Object.entries(oscillators)
    .map(([_, osc]) => {
      if (osc.route !== 'master') return Array.from<number>({ length: sampleRate }).fill(0);

      return generateOscMix(sampleRate, osc, controls, effects);
    })
    .forEach(oscSamples => {
      oscSamples.forEach((sample, i) => {
        samples[i] += sample;
      });
    });

  return samples.map(sample => {
    return clamp(sample, -1.0, 1.0);
  });
}

export function renderAllWaves(sampleRate: number) {
  let oscillators = { ...atomOscillators.get() };
  let controls = { ...atomControls.get() };
  let effects = { ...atomEffects.get() };
  let lfos = { ...atomLFOs.get() };

  const result: number[] = [];

  for (let time = 0; time < 64; time++) {
    const timeNormalized = time / (TOTAL_FRAME_COUNT - 1);

    lfos = Object.fromEntries(Object.entries({ ...lfos }).map(
      ([id, lfo]) => {
        const intersection = findIntersection(lfo, timeNormalized);
        if (intersection) lfo.current = { ...intersection };
        return [id, lfo];
      }
    ));

    Object.entries(lfos).forEach(([_, lfo]) => {
      lfo.controls.forEach(lfoControl => {
        controls[lfoControl.id].value = controls[lfoControl.id].valueMap(
          mapRange(
            lfoControl.direction === 'backward'
              ? (1.0 - lfo.current.amount)
              : lfo.current.amount,
            0.0,
            1.0,
            controls[lfoControl.id].rangeMin,
            controls[lfoControl.id].rangeMax,
          )
        );
      });
    });

    result.push(...generateMasterMix(sampleRate, oscillators, controls, effects));
  }

  return result;
}

const findIntersection = (lfo: LFOState, time: number) => {
  const nodes = [
    { time: 0, amount: lfo.edgeNode.amount },
    ...lfo.nodes,
    { time: 1, amount: lfo.edgeNode.amount },
  ];

  for (let i = 0; i < nodes.length - 1; i++) {
    let node = nodes[i];
    let nextNode = nodes[i + 1];

    if (time >= node.time && time <= nextNode.time) {
      let amt = node.amount + ((nextNode.amount - node.amount) / (nextNode.time - node.time)) * (time - node.time);
      return { time, amount: amt };
    }
  }

  return null;
}
