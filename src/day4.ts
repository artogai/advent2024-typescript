import { log } from "console";
import * as IO from "./utils/io.js";
import * as Point from "./utils/point.js";
import * as Matrix from "./utils/matrix.js";

const DIRECTIONS: readonly Point.RO[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const CORNERS: readonly Point.RO[] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const CORNER_VALUES: readonly string[] = ["MMSS", "MSMS", "SSMM", "SMSM"];

part1();
part2();

function part1() {
  const field = IO.readLines("./input/day4.txt").map((x) => x.split(""));
  const res = countXmas(field);

  log(res);
}

function part2() {
  const field = IO.readLines("./input/day4.txt").map((x) => x.split(""));
  const res = countMas(field);

  log(res);
}

function countXmas(m: Matrix.RO<string>): number {
  let acc = 0;

  for (const [v, row, col] of Matrix.iter(m)) {
    if (v === "X") {
      for (const dir of DIRECTIONS) {
        acc += search("XMAS", [row, col], dir, m) ? 1 : 0;
      }
    }
  }

  return acc;
}

function countMas(m: Matrix.RO<string>): number {
  let acc = 0;
  for (const [v, row, col] of Matrix.iter(m)) {
    if (v === "A") {
      const cornerValue = CORNERS.map((pos) => {
        const newPos = Point.move([row, col], pos);
        return m[newPos[0]][newPos[1]] ?? "";
      }).join("");

      if (CORNER_VALUES.includes(cornerValue)) {
        acc++;
      }
    }
  }

  return acc;
}

function search(
  pattern: string,
  pos: Point.RO,
  delta: Point.RO,
  m: Matrix.RO<string>,
): boolean {
  if (pattern.length == 0) {
    return true;
  }

  if (pattern[0] !== m[pos[0]][pos[1]]) {
    return false;
  }

  return search(pattern.substring(1), Point.move(pos, delta), delta, m);
}
