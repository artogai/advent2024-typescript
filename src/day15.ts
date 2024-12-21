import { log } from "console";
import { readLines } from "./utils.js";
import * as Arrays from "./utils/arrays.js";
import * as Matrix from "./utils/matrix.js";

type Wall = "#";
type Box = "O";
type Empty = ".";
type Robot = "@";

type BoxLeft = "[";
type BoxRight = "]";

type Tile = Wall | Box | BoxLeft | BoxRight | Empty | Robot;

type Up = "^";
type Down = "v";
type Left = "<";
type Right = ">";

type Direction = Up | Down | Left | Right;

const deltas: Record<Direction, [number, number]> = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};

part(false);
part(true);

function part(shouldExpand: boolean) {
  const inp = parse("./input/day15.txt");
  let m = inp[0];
  const dirs = inp[1];

  if (shouldExpand) {
    m = expand(m);
  }

  let pos = findRobot(m) ?? [0, 0];
  for (const dir of dirs) {
    pos = move(pos, dir, m);
  }

  const res = calcGpsCoord(m);
  log(res);
}

function move(
  pos: [number, number],
  dir: Direction,
  m: Matrix.RW<Tile>,
): [number, number] {
  const nextPos = applyDir(pos, dir);
  const nextTile = m[nextPos[0]][nextPos[1]];

  switch (nextTile) {
    case "@":
      throw new Error("duplicate robot");
    case "#":
      return pos;
    case ".":
      return moveRobot(pos, nextPos, m);
    case "O":
    case "[":
    case "]": {
      const buff: [number, number][] = [];
      const canMove = collectBoxes(pos, dir, buff, m);
      if (!canMove) {
        return pos;
      }
      executeMove(Arrays.distinct(buff), dir, m);
      return nextPos;
    }
  }
}

function executeMove(
  points: [number, number][],
  dir: Direction,
  m: Matrix.RW<Tile>,
) {
  const tiles = points.map((pos) => m[pos[0]][pos[1]]);
  points.forEach((pos) => (m[pos[0]][pos[1]] = "."));
  const newPoints = points.map((pos) => applyDir(pos, dir));
  newPoints.forEach((pos, i) => (m[pos[0]][pos[1]] = tiles[i]));
}

function collectBoxes(
  pos: [number, number],
  dir: Direction,
  buff: [number, number][],
  m: Matrix.RO<Tile>,
): boolean {
  buff.push(pos);
  const nextPos = applyDir(pos, dir);
  const nextTile = m[nextPos[0]][nextPos[1]];
  switch (nextTile) {
    case "@":
      throw new Error("duplicate robot");
    case "#":
      return false;
    case ".":
      return true;
    case "O":
      return collectBoxes(nextPos, dir, buff, m);
    case "[":
    case "]": {
      const canMove = collectBoxes(nextPos, dir, buff, m);
      if (dir === "<" || dir === ">") {
        return canMove;
      }
      switch (nextTile) {
        case "[":
          return canMove && collectBoxes(applyDir(nextPos, ">"), dir, buff, m);
        case "]":
          return canMove && collectBoxes(applyDir(nextPos, "<"), dir, buff, m);
      }
    }
  }
}

function moveRobot(
  from: [number, number],
  to: [number, number],
  m: Matrix.RW<Tile>,
): [number, number] {
  m[from[0]][from[1]] = ".";
  m[to[0]][to[1]] = "@";
  return to;
}

function parse(path: string): [Matrix.RW<Tile>, Direction[]] {
  const [fieldInp, dirsInp] = Arrays.split(readLines(path), "");
  const field = parseField(fieldInp);
  const dirs = parseDirections(dirsInp);
  return [field, dirs];
}

function parseField(fieldInp: readonly string[]): Matrix.RW<Tile> {
  return fieldInp.map((line) => line.split("").map((v) => v as Tile));
}

function parseDirections(dirsInp: readonly string[]): Direction[] {
  return dirsInp.flatMap((line) => line.split("").map((d) => d as Direction));
}

function expand(m: Matrix.RO<Tile>): Matrix.RW<Tile> {
  return m.map((row) =>
    row.flatMap((v) => {
      switch (v) {
        case "#":
          return ["#", "#"];
        case "O":
          return ["[", "]"];
        case ".":
          return [".", "."];
        case "@":
          return ["@", "."];
        case "[":
          return [];
        case "]":
          return [];
      }
    }),
  );
}

function applyDir(
  pos: readonly [number, number],
  dir: Direction,
): [number, number] {
  const delta = deltas[dir];
  return [pos[0] + delta[0], pos[1] + delta[1]];
}

function findRobot(m: Matrix.RO<Tile>): [number, number] | undefined {
  for (const [tile, row, col] of Matrix.iter(m)) {
    if (tile === "@") {
      return [row, col];
    }
  }
  return undefined;
}

function calcGpsCoord(m: Matrix.RO<Tile>): number {
  let res = 0;

  for (const [tile, row, col] of Matrix.iter(m)) {
    if (tile === "O" || tile === "[") {
      res += row * 100 + col;
    }
  }

  return res;
}
