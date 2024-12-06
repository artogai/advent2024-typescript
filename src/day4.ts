import { log } from "console";
import { readLines } from "./utils.js";

const DIRECTIONS: readonly [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const CORNERS: readonly [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const CORNER_VALUES: readonly string[] = ["MMSS", "MSMS", "SSMM", "SMSM"];

part1();
part2();

function part1() {
  const field = readLines("./input/day4.txt").map((x) => x.split(""));
  const res = countXmas(field);

  log(res);
}

function part2() {
  const field = readLines("./input/day4.txt").map((x) => x.split(""));
  const res = countMas(field);

  log(res);
}

function countXmas(field: string[][]): number {
  let acc = 0;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      if (get(i, j, field) === "X") {
        for (const dir of DIRECTIONS) {
          acc += search("XMAS", i, j, dir, field) ? 1 : 0;
        }
      }
    }
  }

  return acc;
}

function countMas(field: string[][]): number {
  let acc = 0;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      if (get(i, j, field) === "A") {
        const cornerValue = CORNERS.map((idx) => {
          return get(i + idx[0], j + idx[1], field) ?? "";
        }).join("");

        if (CORNER_VALUES.includes(cornerValue)) {
          acc++;
        }
      }
    }
  }

  return acc;
}

function search(
  pattern: string,
  i: number,
  j: number,
  dir: [number, number],
  field: string[][],
): boolean {
  if (pattern.length == 0) {
    return true;
  }

  if (pattern[0] !== get(i, j, field)) {
    return false;
  }

  return search(pattern.substring(1), i + dir[0], j + dir[1], dir, field);
}

function get(
  row: number,
  column: number,
  field: string[][],
): string | undefined {
  return field[row]?.[column];
}
