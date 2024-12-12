import { log } from "console";
import { readFileSync } from "fs";

part(25);
part(75);

function part(n: number) {
  const stones = readFileSync("./input/day11.txt", "utf-8")
    .split(" ")
    .map(Number);
  const cache = new Map<string, number>();
  const res = stones.reduce((acc, s) => {
    return acc + blink(s, n, cache);
  }, 0);
  log(res);
}

function blink(s: number, blinks: number, cache: Map<string, number>): number {
  if (blinks === 0) {
    return 1;
  }

  const key = [s, blinks].toString();
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const res = blinkOnce(s).reduce((acc, s) => {
    return acc + blink(s, blinks - 1, cache);
  }, 0);
  cache.set(key, res);
  return res;
}

function blinkOnce(s: number): number[] {
  if (s === 0) {
    return [1];
  } else {
    const digits = Math.floor(Math.log10(s)) + 1;
    if (digits % 2 === 0) {
      const halfDigits = digits / 2;
      const divisor = Math.pow(10, halfDigits);
      const left = Math.floor(s / divisor);
      const right = s % divisor;
      return [left, right];
    } else {
      return [s * 2024];
    }
  }
}
