import { log } from "console";
import * as Matrix from "./utils/matrix";
import * as Arrays from "./utils/arrays";
import * as Point from "./utils/point";
import * as Direction from "./utils/direction";
import { PriorityQueue } from "js-sdsl";
import { List } from "immutable";

type Wall = "#";
type Empty = ".";
type Tile = Empty | Wall;

part();

function part() {
  const [start, end, m] = parse("./input/day16.txt");
  const [shortestLen, tilesCntInPaths] = getShortestPaths(start, end, m);
  log(shortestLen);
  log(tilesCntInPaths);
}

function getShortestPaths(
  start: Point.RO,
  end: Point.RO,
  m: Matrix.RO<Tile>,
): [number, number] {
  const dist = Matrix.createAs(m, () => Infinity);
  dist[start[0]][start[1]] = 0;

  const visited = new Map<string, number>();
  const queue = new PriorityQueue(
    [
      {
        pos: start,
        dir: ">" as Direction.Direction,
        len: 0,
        path: List([start]),
      },
    ],
    (x, y) => x.len - y.len,
  );

  let shortestPathsTiles: Set<string> = new Set();
  let shortestLen = Infinity;

  while (queue.length !== 0) {
    const { pos, dir, len, path } = queue.pop()!;

    if (Arrays.equal(pos, end)) {
      if (len < shortestLen) {
        shortestPathsTiles = new Set(path.map((x) => x.toString()));
        shortestLen = len;
      } else if (len === shortestLen) {
        path.forEach((x) => shortestPathsTiles.add(x.toString()));
      }
      continue;
    }

    const stateKey = `${pos[0].toString()}_${pos[1].toString()}_${dir}`;
    const minLen = visited.get(stateKey);
    if (minLen !== undefined && minLen < len) {
      continue;
    }
    visited.set(stateKey, len);

    const nextStates = [
      { dir: rotate90(dir, true), pos, len: len + 1000 },
      { dir: rotate90(dir, false), pos, len: len + 1000 },
      { dir, pos: Direction.move(pos, dir), len: len + 1 },
    ].filter((state) => m[state.pos[0]][state.pos[1]] === ".");

    for (const state of nextStates) {
      queue.push({
        pos: state.pos,
        dir: state.dir,
        len: state.len,
        path: path.unshift(state.pos),
      });
    }
  }

  return [shortestLen, shortestPathsTiles.size];
}

function rotate90(
  dir: Direction.Direction,
  isClockwise: boolean,
): Direction.Direction {
  const idx =
    Direction.values.findIndex((d) => d === dir) + (isClockwise ? 1 : -1);
  return Direction.values.at(idx % Direction.values.length)!;
}

function parse(path: string): [Point.RW, Point.RW, Matrix.RW<Tile>] {
  let start: Point.RW = [-1, -1];
  let end: Point.RW = [-1, -1];

  const m = Matrix.readFile(path, (s, row, col) => {
    switch (s) {
      case "S": {
        start = [row, col];
        return ".";
      }
      case "E": {
        end = [row, col];
        return ".";
      }
      default:
        return s as Tile;
    }
  });

  return [start, end, m];
}
