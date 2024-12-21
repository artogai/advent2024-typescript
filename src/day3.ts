import { log } from "console";
import * as IO from "./utils/io";

const MUL_OP = /mul\((\d+),(\d+)\)/g;
const MUL_OP_WITH_INSTR = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;

part1();
part2();

function part1() {
  const res = IO.readLines("./input/day3.txt").reduce(
    (acc, line) => acc + parseMemory(line),
    0,
  );

  log(res);
}

function part2() {
  const res = IO.readLines("./input/day3.txt").reduce(
    (acc, line) => acc + parseMemoryWithInstructions(line),
    0,
  );

  log(res);
}

function parseMemory(mem: string): number {
  let acc = 0;

  for (const match of mem.matchAll(MUL_OP)) {
    acc += Number(match[1]) * Number(match[2]);
  }

  return acc;
}

function parseMemoryWithInstructions(mem: string): number {
  let acc = 0;
  let enabled = true;

  for (const match of mem.matchAll(MUL_OP_WITH_INSTR)) {
    switch (match[0]) {
      case "do()":
        enabled = true;
        break;
      case "don't()":
        enabled = false;
        break;
      default:
        if (enabled) {
          acc += Number(match[1]) * Number(match[2]);
        }
        break;
    }
  }

  return acc;
}
