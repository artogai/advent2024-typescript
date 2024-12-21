import { log } from "console";
import * as Arrays from "./utils/arrays.js";
import * as Matrix from "./utils/matrix.js";
import * as IO from "./utils/io.js";
import * as Direction from "./utils/direction.js";
import * as Point from "./utils/point.js";

type Wall = "#";
type Box = "O";
type Empty = ".";
type Robot = "@";

type BoxLeft = "[";
type BoxRight = "]";

type Tile = Wall | Box | BoxLeft | BoxRight | Empty | Robot;

part(false);
part(true);

function part(shouldExpand: boolean) {
  const inp = parse("./input/day15.txt");
  let m = inp[0];
  const dirs = inp[1];

  if (shouldExpand) {
    m = expand(m);
  }

  let pos: Point.RO = findRobot(m) ?? [0, 0];
  for (const dir of dirs) {
    pos = move(pos, dir, m);
  }

  const res = calcGpsCoord(m);
  log(res);
}

function move(
  pos: Point.RO,
  dir: Direction.Direction,
  m: Matrix.RW<Tile>,
): Point.RO {
  const nextPos = Direction.move(pos, dir);
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
      const buff: Point.RO[] = [];
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
  points: Point.RO[],
  dir: Direction.Direction,
  m: Matrix.RW<Tile>,
) {
  const tiles = points.map((pos) => m[pos[0]][pos[1]]);
  points.forEach((pos) => (m[pos[0]][pos[1]] = "."));
  const newPoints = points.map((pos) => Direction.move(pos, dir));
  newPoints.forEach((pos, i) => (m[pos[0]][pos[1]] = tiles[i]));
}

function collectBoxes(
  pos: Point.RO,
  dir: Direction.Direction,
  buff: Point.RO[],
  m: Matrix.RO<Tile>,
): boolean {
  buff.push(pos);
  const nextPos = Direction.move(pos, dir);
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
          return (
            canMove && collectBoxes(Direction.move(nextPos, ">"), dir, buff, m)
          );
        case "]":
          return (
            canMove && collectBoxes(Direction.move(nextPos, "<"), dir, buff, m)
          );
      }
    }
  }
}

function moveRobot(from: Point.RO, to: Point.RO, m: Matrix.RW<Tile>): Point.RO {
  m[from[0]][from[1]] = ".";
  m[to[0]][to[1]] = "@";
  return to;
}

function parse(path: string): [Matrix.RW<Tile>, Direction.Direction[]] {
  const [mInp, dirsInp] = Arrays.split(IO.readLines(path), "");
  const m = Matrix.parseLines(mInp, (v) => v as Tile);
  const dirs = parseDirections(dirsInp);
  return [m, dirs];
}

function parseDirections(dirsInp: readonly string[]): Direction.Direction[] {
  return dirsInp.flatMap((line) =>
    line.split("").map((d) => d as Direction.Direction),
  );
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

function findRobot(m: Matrix.RO<Tile>): Point.RW | undefined {
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
