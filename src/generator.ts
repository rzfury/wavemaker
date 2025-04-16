export function createControlState(id: string, range: [number, number], valueMap: (val: number) => number, defaultValue: number = 0): ControlState {
  return {
    id,
    value: defaultValue,
    rangeMin: range[0],
    rangeMax: range[1],
    valueMap,
    lfo: null
  };
}

export function createOscillatorState(id: string, controls: OscillatorState['controls']): OscillatorState {
  return {
    id,
    wave: 'sine',
    controls,
    effects: [],
    route: 'master',
    routeInput: null,
  };
}

export function createLFOState(id: string): LFOState {
  return {
    id,
    controls: [],
    nodes: [
      { amount: 1.0, time: 0.5 },
    ],
    current: {
      amount: 0.0,
      time: 0.0,
    },
    edgeNode: {
      amount: 0.0,
    },
    rate: 1,
  };
}
