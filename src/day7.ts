import { log } from "console";
import * as IO from "./utils/io";

type Operation = "+" | "*" | "||";

part1();
part2();

function part1() {
  const res = countCalibration("./input/day7.txt", ["+", "*"]);
  log(res);
}

function part2() {
  const res = countCalibration("./input/day7.txt", ["+", "*", "||"]);
  log(res);
}

function countCalibration(path: string, opsSet: Operation[]): number {
  return IO.readLines(path)
    .map(parseLine)
    .filter(({ res, operands }) => isValidResult(res, operands, opsSet))
    .reduce((acc, v) => acc + v.res, 0);
}

function parseLine(s: string): { res: number; operands: number[] } {
  const [l, r] = s.split(": ");
  return { res: Number(l), operands: r.split(" ").map(Number) };
}

function isValidResult(
  res: number,
  operands: number[],
  opsSet: readonly Operation[],
): boolean {
  for (const ops of genOperations(opsSet, operands.length - 1)) {
    if (res === evaluate(operands, ops)) {
      return true;
    }
  }
  return false;
}

function* genOperations(
  opsSet: readonly Operation[],
  n: number,
): Generator<Operation[], void> {
  const base = opsSet.length;
  const total = Math.pow(base, n);
  for (let i = 0; i < total; i++) {
    const inbase = i.toString(base).padStart(n, "0");
    const ops = inbase.split("").map((i) => opsSet[Number(i)]);
    yield ops;
  }
}

function evaluate(
  operands: readonly number[],
  ops: readonly Operation[],
): number {
  function ev(op: Operation, v1: number, v2: number): number {
    switch (op) {
      case "+":
        return v1 + v2;
      case "*":
        return v1 * v2;
      case "||":
        return Number(v1.toString() + v2.toString());
    }
  }

  return operands.reduce((prev, next, i) => ev(ops[i - 1], prev, next));
}
