/// <reference types="vite/client" />

type Maybe<T> = T | null
type Optional<T> = T | undefined
type Nil<T> = T | null | undefined
type Fn<T = void> = () => T
type Primitive = string | number | boolean

type SaveDataPatch = {
  oscillators: { [key: string]: OscillatorState },
  controls: { [key: string]: ControlState },
  effects: { [key: string]: EffectState },
  lfos: { [key: string]: LFOState },
}

type RouteState = {
  sourceOscId: string,
  destinationType: 'master' | 'fx-mixer',
  destinationPort: number,
  destinationId: string,
  level: number,
}

type OscillatorState = {
  id: string,
  wave: 'sine' | 'pulse' | 'triangle' | 'saw',
  controls: {
    mul: string,
    phase: string,
    amp: string,
    duty: string,
    vol: string,
  },
  effects: string[],
  route: 'master' | 'input' | 'none',
  routeInput?: Maybe<string>,
}

type EffectState = {
  id: string,
  oscillator: string,
  controls: { [key: string]: string },
  bypass: boolean,
  type: 'reverse' | 'gain' | 'filter-1' | 'fm' | 'delay'
}

type ControlState = {
  id: string,
  value: number,
  rangeMin: number,
  rangeMax: number,
  valueMap: (value: number) => number,
  lfo?: Maybe<string>,
}

type LFOState = {
  id: string,
  nodes: { amount: number, time: number }[],
  controls: {
    id: string,
    direction: 'forward' | 'backward',
  }[],
  current: { amount: number, time: number },
  rate: number,
  edgeNode: { amount: number, },
}
