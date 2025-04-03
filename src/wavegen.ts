import { clamp, SAMPLE_RATE } from './common';

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

export function generateOscBase(osc: OscillatorState, controls: { [key: string]: ControlState }) {
  if (osc.wave === 'sine') {
    return Array.from({ length: SAMPLE_RATE }, (_, i) => {
      const t = i / SAMPLE_RATE;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateSine(t, mul, phase, amp);
    });
  }

  if (osc.wave === 'pulse') {
    return Array.from({ length: SAMPLE_RATE }, (_, i) => {
      const t = i / SAMPLE_RATE;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      const duty = controls[osc.controls.duty].value;
      return calculatePulse(t, mul, phase, amp, duty);
    });
  }

  if (osc.wave === 'saw') {
    return Array.from({ length: SAMPLE_RATE }, (_, i) => {
      const t = i / SAMPLE_RATE;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateSaw(t, mul, phase, amp);
    });
  }

  if (osc.wave === 'triangle') {
    return Array.from({ length: SAMPLE_RATE }, (_, i) => {
      const t = i / SAMPLE_RATE;
      const mul = controls[osc.controls.mul].value;
      const phase = controls[osc.controls.phase].value;
      const amp = controls[osc.controls.amp].value;
      return calculateTriangle(t, mul, phase, amp);
    });
  }

  return [];
}

export function generateOscMix(
  oscillator: OscillatorState,
  controls: { [key: string]: ControlState },
  effects: { [key: string]: EffectState },
) {
  const baseSamples = generateOscBase(oscillator, controls);

  return baseSamples;
}

export function generateMasterMix(oscillators: { [key: string]: OscillatorState }, controls: { [key: string]: ControlState }) {
  return Array.from({ length: SAMPLE_RATE }, (_, i) => {
    const t = i / SAMPLE_RATE;
    return Object.entries(oscillators).map(([_, osc]) => osc).reduce((prev, osc, _) => {
      if (osc.route !== 'master') return 0;

      if (osc.wave === 'sine') {
        const mul = controls[osc.controls.mul].value;
        const phase = controls[osc.controls.phase].value;
        const amp = controls[osc.controls.amp].value;
        return clamp(calculateSine(t, mul, phase, amp) + prev, -1.0, 1.0);
      }

      if (osc.wave === 'pulse') {
        const mul = controls[osc.controls.mul].value;
        const phase = controls[osc.controls.phase].value;
        const amp = controls[osc.controls.amp].value;
        const duty = controls[osc.controls.duty].value;
        return clamp(calculatePulse(t, mul, phase, amp, duty) + prev, -1.0, 1.0);
      }

      if (osc.wave === 'saw') {
        const mul = controls[osc.controls.mul].value;
        const phase = controls[osc.controls.phase].value;
        const amp = controls[osc.controls.amp].value;
        return clamp(calculateSaw(t, mul, phase, amp) + prev, -1.0, 1.0);
      }

      if (osc.wave === 'triangle') {
        const mul = controls[osc.controls.mul].value;
        const phase = controls[osc.controls.phase].value;
        const amp = controls[osc.controls.amp].value;
        return clamp(calculateTriangle(t, mul, phase, amp) + prev, -1.0, 1.0);
      }

      return 0;
    }, 0);
  });
}
