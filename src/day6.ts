import { log } from "console";
import * as Point from "./utils/point.js";
import * as Matrix from "./utils/matrix.js";
import * as Direction from "./utils/direction.js";
import * as Arrays from "./utils/arrays.js";

type Wall = "#";
type Empty = ".";

type Tile = Direction.Direction | Wall | Empty;

part1();
part2();

function part1() {
  const m = Matrix.readFile("./input/day6.txt", (s) => s as Tile);
  const start = Matrix.find(m, (t) => t === "^") ?? [0, 0];
  traverse(start, m);
  const traversedCnt = countTraversed(m);

  log(traversedCnt);
}

function part2() {
  const m = Matrix.readFile("./input/day6.txt", (s) => s as Tile);
  const start = Matrix.find(m, (t) => t === "^") ?? [0, 0];

  const mc = Matrix.copy(m);
  traverse(start, mc);

  let acc = 0;

  for (const [tile, row, col] of Matrix.iter(mc)) {
    if (row === start[0] && col === start[1]) {
      continue;
    }

    // it makes sense to place obstacles only on previous path
    if (!Direction.is(tile)) {
      continue;
    }

    const mc2 = Matrix.copy(m);
    mc2[row][col] = "#";
    const isCycle = !traverse(start, mc2);
    if (isCycle) {
      acc++;
    }
  }
  log(acc);
}

function traverse(
  start: Point.RO,
  m: Matrix.RW<Tile>,
  dir: Direction.Direction = "^",
): boolean {
  const pathFlagsByDirection = new Map(
    Direction.values.map(
      (dir) => [dir, Matrix.createAs(m, () => false)] as const,
    ),
  );

  let [currRow, currCol] = start;
  let currDir = dir;

  traverse: for (;;) {
    const pathFlags = pathFlagsByDirection.get(currDir)!;

    if (pathFlags[currRow][currCol]) {
      // cycle detected
      return false;
    }

    pathFlags[currRow][currCol] = true;

    m[currRow][currCol] = currDir;
    const [nextRow, nextCol] = Direction.move([currRow, currCol], currDir);

    const nextField = safeAt(safeAt(m, nextRow), nextCol);

    switch (nextField) {
      case undefined:
        break traverse;
      case "#":
        currDir = Direction.rotate90(currDir);
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

function countTraversed(m: Matrix.RO<Tile>): number {
  return Arrays.sum(m.map((row) => row.filter(Direction.is).length));
}

// ignores negative indexes
function safeAt<A>(arr: readonly A[] | undefined, idx: number): A | undefined {
  if (!arr || idx < 0 || idx >= arr.length) {
    return undefined;
  }
  return arr[idx];
}
