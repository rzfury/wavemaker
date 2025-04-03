/// <reference types="vite/client" />

type Maybe<T> = T | null
type Optional<T> = T | undefined
type Nil<T> = T | null | undefined
type Fn<T = void> = () => T
type Primitive = string | number | boolean

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
  function: (samples: number[]) => number[]
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
  controls: { id: string, bypass: boolean }[],
  current: { amount: number, time: number },
  edgeNode: { amount: number, },
}
