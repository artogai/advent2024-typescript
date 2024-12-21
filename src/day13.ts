import { log } from "console";
import * as IO from "./utils/io";
import * as Point from "./utils/point";
import * as Arrays from "./utils/arrays";

const offset = 10000000000000;

part(false);
part(true);

function part(isOffsetEnabled: boolean) {
  const res = parse("./input/day13.txt").reduce((acc, m) => {
    const [aCnt, bCnt] = solve(
      m[0],
      m[1],
      isOffsetEnabled ? Point.move(m[2], [offset, offset]) : m[2],
    ) ?? [0, 0];
    return acc + bCnt + aCnt * 3;
  }, 0);

  log(res);
}

function solve(a: Point.RO, b: Point.RO, p: Point.RO): Point.RW | undefined {
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

function det(a: Point.RO, b: Point.RO): number {
  return a[0] * b[1] - a[1] * b[0];
}

function parse(path: string): Point.RW[][] {
  return Arrays.split(IO.readLines(path), "").map(parseMachine);
}

function parseMachine(input: string[]): Point.RW[] {
  return input.flatMap((line) => {
    const matches = line.match(/\d+/g);
    if (!matches || matches.length != 2) {
      return [];
    }
    return [[Number(matches[0]), Number(matches[1])]];
  });
}
