import { log } from "console";
import * as IO from "./utils/io";
import * as Arrays from "./utils/arrays";

part1();
part2();

function part1() {
  const [rules, updates] = parse("./input/day5.txt");

  const res = updates
    .filter((upd) => {
      return checkUpdates(upd, rules);
    })
    .reduce((acc, upd) => {
      return acc + middle(upd);
    }, 0);

  log(res);
}

function part2() {
  const [rules, updates] = parse("./input/day5.txt");

  const res = updates
    .filter((upd) => {
      return !checkUpdates(upd, rules);
    })
    .map((upd) => {
      return fixOrder(upd, rules);
    })
    .reduce((acc, upd) => {
      return acc + middle(upd);
    }, 0);

  log(res);
}

function fixOrder(
  upd: readonly number[],
  rules: readonly (readonly [number, number])[],
): number[] {
  let fixed = false;
  const updCopy = upd.slice();

  while (!fixed) {
    fixed = true;

    for (let i = 0; i < updCopy.length - 1; i++) {
      for (let j = i + 1; j < updCopy.length; j++) {
        if (rules.some((arr) => Arrays.equal(arr, [updCopy[j], updCopy[i]]))) {
          fixed = false;
          const temp = updCopy[i];
          updCopy[i] = updCopy[j];
          updCopy[j] = temp;
        }
      }
    }
  }

  return updCopy;
}

function checkUpdates(
  upd: readonly number[],
  rules: readonly (readonly [number, number])[],
): boolean {
  for (let i = 0; i < upd.length - 1; i++) {
    for (let j = i + 1; j < upd.length; j++) {
      if (rules.some((arr) => Arrays.equal(arr, [upd[j], upd[i]]))) {
        return false;
      }
    }
  }

  return true;
}

function middle(upd: readonly number[]): number {
  return upd[Math.floor(upd.length / 2)];
}

function parse(path: string): [[number, number][], number[][]] {
  const [l, r] = IO.readLines(path).reduce<string[][]>((acc, s) => {
    if (s === "") {
      acc.push([]);
    } else {
      if (acc.length === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(s);
    }
    return acc;
  }, []);

  return [l.map(parseRule), r.map(parseUpdate)];
}

function parseRule(s: string): [number, number] {
  return s.split("|").map(Number) as [number, number];
}

function parseUpdate(s: string): number[] {
  return s.split(",").map(Number);
}
