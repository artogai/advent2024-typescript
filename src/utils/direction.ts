import * as Point from "./point";

export type Up = "^";
export type Down = "v";
export type Left = "<";
export type Right = ">";

export type Direction = Up | Down | Left | Right;

export const values: readonly Direction[] = ["^", ">", "v", "<"];

export const deltas: Record<Direction, Point.RO> = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};

export function move(p: Point.RO, dir: Direction): Point.RW {
  const delta = deltas[dir];
  return [p[0] + delta[0], p[1] + delta[1]];
}

export function rotate90(
  dir: Direction,
  isClockwise: boolean = true,
): Direction {
  const idx = values.findIndex((d) => d === dir) + (isClockwise ? 1 : -1);
  return values.at(idx % values.length)!;
}

export function is(s: string): s is Direction {
  return values.some((v) => s === v);
}
