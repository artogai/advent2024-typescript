import * as Matrix from "./utils/matrix";
import * as Point from "./utils/point";
import * as Arrays from "./utils/arrays";
import * as Direction from "./utils/direction";
import { log } from "console";

type Tile = "." | "#";

part(2);
part(20);

function part(cheatLen: number) {
  const [start, end, m] = parse("./input/day20.txt");
  const path = buildPath(start, end, m);
  const cnt = countGains(path, cheatLen, 100);
  log(cnt);
}

function countGains(
  path: Point.RO[],
  cheatLen: number,
  cheatGain: number,
): number {
  let cnt = 0;
  for (const [fromIdx, toIdx] of getPairs(path)) {
    const from = path[fromIdx];
    const to = path[toIdx];
    const jumpTime = manhattanDist(from, to);
    const gain = toIdx - fromIdx - jumpTime;

    if (jumpTime <= cheatLen && gain >= cheatGain) {
      cnt += 1;
    }
  }
  return cnt;
}

function* getPairs<A>(arr: A[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [i, j];
    }
  }
}

function manhattanDist(from: Point.RO, to: Point.RO): number {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
}

function buildPath(
  start: Point.RO,
  end: Point.RO,
  m: Matrix.RO<Tile>,
): Point.RO[] {
  const path: Point.RO[] = [start];

  for (;;) {
    const curr = path[path.length - 1];
    const prev = path.length < 2 ? undefined : path[path.length - 2];

    if (Arrays.equal(curr, end)) {
      break;
    }

    const next = Direction.values
      .map((dir) => Direction.move(curr, dir))
      .filter(
        (n) => (!prev || !Arrays.equal(n, prev)) && m[n[0]][n[1]] !== "#",
      );

    if (next.length !== 1) {
      throw new Error("multiple paths detected");
    }

    path.push(next[0]);
  }

  return path;
}

function parse(path: string): [Point.RO, Point.RO, Matrix.RW<Tile>] {
  let start: Point.RO = [-1, -1];
  let end: Point.RO = [-1, -1];

  const m = Matrix.map(
    Matrix.readFile(path, (s) => s),
    (s, idx) => {
      switch (s) {
        case "S": {
          start = idx;
          return ".";
        }
        case "E": {
          end = idx;
          return ".";
        }
        default: {
          return s as Tile;
        }
      }
    },
  );

  return [start, end, m];
}
