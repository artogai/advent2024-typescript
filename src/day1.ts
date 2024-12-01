import { log } from "console";
import { readLines } from "./utils.js";

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

function zip<A, B>(arr1: readonly A[], arr2: readonly B[]): [A, B][] {
  const arr: [A, B][] = [];
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    arr.push([arr1[i], arr2[i]]);
  }
  return arr;
}

function unzip<A, B>(arr: readonly [A, B][]): [A[], B[]] {
  const arr1: A[] = [];
  const arr2: B[] = [];
  for (const v of arr) {
    arr1.push(v[0]);
    arr2.push(v[1]);
  }
  return [arr1, arr2];
}