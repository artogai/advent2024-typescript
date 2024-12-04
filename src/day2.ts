import { log } from "console";
import { readLines, zip } from "./utils.js";

part1();
part2();

function part1() {
  log(countPart(false));
}

function part2() {
  log(countPart(true));
}

function countPart(skipsEnabled: boolean): number {
  const levels = readLines("./input/day2.txt").map((line) => {
    return line.split(" ").map(Number);
  });

  return countSafeLevels(levels, skipsEnabled);
}

function countSafeLevels(levels: number[][], skipsEnabled: boolean) {
  return levels.reduce((acc, level) => {
    return isLevelSafe(level, skipsEnabled) ? acc + 1 : acc;
  }, 0);
}

function isLevelSafe(level: number[], skipsEnabled: boolean): boolean {
  if (checkLevel(level)) {
    return true;
  }
  if (!skipsEnabled) {
    return false;
  }

  for (let i = 0; i < level.length; i++) {
    const levelWithSkip = level.slice();
    levelWithSkip.splice(i, 1);
    if (checkLevel(levelWithSkip)) {
      return true;
    }
  }

  return false;
}

function checkLevel(level: number[]): boolean {
  return zip(level, level.slice(1))
    .map(([l, r]) => {
      return l - r;
    })
    .every((diff, _, arr) => {
      return (arr[0] < 0 ? diff < 0 : diff > 0) && isDiffValueSafe(diff);
    });
}

function isDiffValueSafe(diff: number): boolean {
  return Math.abs(diff) > 0 && Math.abs(diff) < 4;
}