export type RW = [number, number];
export type RO = readonly [number, number];

export function move(p: RO, delta: RO): RW {
  return [p[0] + delta[0], p[1] + delta[1]];
}
