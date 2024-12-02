import { log } from "console";
import { readLines, zip, unzip } from "./utils.js";

part1();
part2();

function part2() {
  const [left, right] = readLocationsIds();

  const rightFreq = right.reduce(
    (acc: Map<number, number>, v: number): Map<number, number> => {
      return acc.set(v, (acc.get(v) ?? 0) + 1);
    },
    new Map(),
  );

  const res = left.reduce((acc: number, v: number): number => {
    return acc + v * (rightFreq.get(v) ?? 0);
  }, 0);

  log(res);
}

function part1() {
  const [left, right] = readLocationsIds();

  left.sort();
  right.sort();

  const res = zip(left, right).reduce(
    (acc: number, [l, r]: [number, number]): number => {
      return acc + Math.abs(l - r);
    },
    0,
  );

  log(res);
}

function readLocationsIds(): [number[], number[]] {
  return unzip(
    readLines("./input/day1.txt").map(
      (line) => line.split(/\s+/).map(Number) as [number, number],
    ),
  );
}
