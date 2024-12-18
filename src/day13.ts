import { log } from "console";
import { arraySplit, readLines } from "./utils.js";

const OFFSET = 10000000000000;

part(false);
part(true);

function part(isOffsetEnabled: boolean) {
  const res = parse("./input/day13.txt").reduce((acc, m) => {
    const [aCnt, bCnt] = solve(
      m[0],
      m[1],
      isOffsetEnabled ? applyOffset(m[2]) : m[2],
    ) ?? [0, 0];
    return acc + bCnt + aCnt * 3;
  }, 0);

  log(res);
}

function applyOffset(p: readonly [number, number]): [number, number] {
  return [OFFSET + p[0], OFFSET + p[1]];
}

function solve(
  a: readonly [number, number],
  b: readonly [number, number],
  p: readonly [number, number],
): [number, number] | undefined {
  const d = det(a, b);
  if (d === 0) {
    return undefined;
  }

  const res0 = (b[1] * p[0] - b[0] * p[1]) / d;
  const res1 = (-a[1] * p[0] + a[0] * p[1]) / d;

  if (Math.floor(res0) !== res0 || Math.floor(res1) !== res1) {
    return undefined;
  }

  return [res0, res1];
}

function det(
  a: readonly [number, number],
  b: readonly [number, number],
): number {
  return a[0] * b[1] - a[1] * b[0];
}

function parse(path: string): [number, number][][] {
  return arraySplit(readLines(path), "").map(parseMachine);
}

function parseMachine(input: string[]): [number, number][] {
  return input.flatMap((line) => {
    const matches = line.match(/\d+/g);
    if (!matches || matches.length != 2) {
      return [];
    }
    return [[Number(matches[0]), Number(matches[1])]];
  });
}
