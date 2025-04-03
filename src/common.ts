export const SAMPLE_RATE = 512 as const;
export const TOTAL_FRAME_COUNT = 64 as const;

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function round(num: number, decimalPlaces = 0): number {
  if (num < 0) return -round(-num, decimalPlaces);
  var p = Math.pow(10, decimalPlaces);
  var n = Number((num * p).toPrecision(15));
  return Math.round(n) / p;
}

export function randstr(size: number = 5): string {
  const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for(let i = 0; i < size; i++) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  return result;
}
