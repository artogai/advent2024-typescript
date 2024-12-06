import { log } from "console";
import { readLines } from "./utils.js";

type Direction = "^" | "v" | ">" | "<";
type Obstacle = "#";
type Empty = ".";

type Field = Direction | Obstacle | Empty;
type TerritoryMap = Field[][];

const ALL_DIRECTIONS: Direction[] = ["^", "v", ">", "<"];

function isDirection(field: Field): field is Direction {
  return ALL_DIRECTIONS.includes(field as Direction);
}

function copyMap(m: TerritoryMap): TerritoryMap {
  return m.map((row) => [...row]);
}

const Direction2DirectionDelta: Record<Direction, readonly [number, number]> = {
  "^": [-1, 0],
  v: [1, 0],
  ">": [0, 1],
  "<": [0, -1],
};

function directionDelta2Direction(d: readonly [number, number]): Direction {
  if (d[0] === -1 && d[1] === 0) {
    return "^";
  } else if (d[0] === 1 && d[1] === 0) {
    return "v";
  } else if (d[0] === 0 && d[1] === 1) {
    return ">";
  } else if (d[0] === 0 && d[1] === -1) {
    return "<";
  } else {
    throw Error(
      `unknow direction delta: ${d[0].toString()} ${d[1].toString()}`,
    );
  }
}

function turn(d: Direction): Direction {
  const delta = Direction2DirectionDelta[d];
  const deltaTurned: [number, number] = [delta[1], -delta[0]];
  return directionDelta2Direction(deltaTurned);
}

function parseMap(path: string): TerritoryMap {
  return readLines(path).map((line) =>
    line.split("").map((c) => c as Direction),
  );
}

function findStart(
  m: TerritoryMap,
  dir: Direction = "^",
): [number, number] | undefined {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j] === dir) {
        return [i, j];
      }
    }
  }

  return undefined;
}

function traverse(
  start: readonly [number, number],
  m: TerritoryMap,
  dir: Direction = "^",
): boolean {
  let [currRow, currCol] = start;
  let currDir = dir;

  const pathFlagsByDirection = new Map(
    ALL_DIRECTIONS.map((dir) => [dir, createBooleanArray(m)]),
  );

  traverse: for (;;) {
    const pathFlags = pathFlagsByDirection.get(currDir);
    if (pathFlags === undefined) {
      throw Error(`flags not specified for direction $currDir`);
    }

    if (pathFlags[currRow][currCol]) {
      // cycle detected
      return false;
    }

    pathFlags[currRow][currCol] = true;

    m[currRow][currCol] = currDir;
    const currDelta = Direction2DirectionDelta[currDir];
    const [nextRow, nextCol] = [currRow + currDelta[0], currCol + currDelta[1]];

    const nextField = safeAt(safeAt(m, nextRow), nextCol);

    switch (nextField) {
      case undefined:
        break traverse;
      case "#":
        currDir = turn(currDir);
        break;
      case ".":
      case "^":
      case "v":
      case ">":
      case "<":
        currRow = nextRow;
        currCol = nextCol;
        break;
    }
  }

  return true;
}

function countTraversed(m: TerritoryMap): number {
  return m
    .map((row) => row.filter(isDirection))
    .reduce((acc, row) => acc + row.length, 0);
}

// ignores negative indexes
function safeAt<A>(arr: readonly A[] | undefined, idx: number): A | undefined {
  if (!arr || idx < 0 || idx >= arr.length) {
    return undefined;
  }
  return arr[idx];
}

function createBooleanArray<A>(original: A[][]): boolean[][] {
  return original.map((row) => row.map(() => false));
}

function part1() {
  const m = parseMap("./input/day6.txt");
  const start = findStart(m) ?? [0, 0];
  traverse(start, m);
  const traversedCnt = countTraversed(m);

  log(traversedCnt);
}

function part2() {
  const m = parseMap("./input/day6.txt");
  const start = findStart(m) ?? [0, 0];

  const mc = copyMap(m);
  traverse(start, mc);

  let acc = 0;

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (i == start[0] && j == start[1]) {
        continue;
      }
      // it makes sense to place obstacles only on previous path
      if (!isDirection(mc[i][j])) {
        continue;
      }

      const mc2 = m.map((row) => [...row]);
      mc2[i][j] = "#";
      const isCycle = !traverse(start, mc2);
      if (isCycle) {
        acc++;
      }
    }
  }

  log(acc);
}

part1();
part2();
