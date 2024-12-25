import { readLines } from "./utils/io";
import * as Arrays from "./utils/arrays";
import { log } from "console";

part();

function part() {
  const [towels, patterns] = parse("./input/day19.txt");
  let possibleCnt = 0;
  let permCnt = 0;
  for (const p of patterns) {
    const cnt = count(p, towels);
    if (cnt > 0) possibleCnt += 1;
    permCnt += cnt;
  }
  log(possibleCnt);
  log(permCnt);
}

function count(pattern: string, towels: readonly string[]): number {
  const memo = new Map<string, number>();

  function rec(pt: string): number {
    if (pt === "") {
      return 1;
    }

    if (memo.has(pt)) {
      return memo.get(pt)!;
    }

    let cnt = 0;
    for (const towel of towels) {
      if (pt.startsWith(towel)) {
        cnt += rec(pt.slice(towel.length));
      }
    }

    memo.set(pt, cnt);
    return cnt;
  }

  return rec(pattern);
}

function parse(path: string): [string[], string[]] {
  const [[left], patterns] = Arrays.split(readLines(path), "");
  const towels = left.split(", ");
  return [towels, patterns];
}
