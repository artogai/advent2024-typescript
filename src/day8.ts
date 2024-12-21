import { log } from "console";
import * as Matrix from "./utils/matrix";
import * as Point from "./utils/point";

type Empty = { kind: "empty"; id: "." };
type Antenna = { kind: "antenna"; id: string; isAntinode: boolean };
type Antinode = { kind: "antinode"; id: "#" };

type Tile = Empty | Antenna | Antinode;

const empty: Empty = { kind: "empty", id: "." };
const antinode: Antinode = { kind: "antinode", id: "#" };

part1();
part2();

function part1() {
  const m = parse("./input/day8.txt");
  const res = calcAntinodes(m);
  log(res);
}

function part2() {
  const m = parse("./input/day8.txt");
  const res = calcAntinodes(m, true);
  log(res);
}

function calcAntinodes(
  m: Matrix.RW<Tile>,
  skipDistance: boolean = false,
): number {
  const antennasIdx = createAntennasIndex(m);

  for (const [_, row, col] of Matrix.iter(m)) {
    const p = [row, col] as const;

    if (checkAntinode(p, antennasIdx, skipDistance)) {
      writeAntinode(p, m);
    }
  }

  return countAntinodes(m);
}

function parse(path: string): Matrix.RW<Tile> {
  return Matrix.readFile(path, (s) => {
    switch (s) {
      case ".":
        return empty;
      default:
        return { kind: "antenna", id: s, isAntinode: false };
    }
  });
}

function createAntennasIndex(m: Matrix.RO<Tile>): Map<string, Point.RO[]> {
  const idx = new Map<string, Point.RO[]>();

  for (const [tile, row, col] of Matrix.iter(m)) {
    if (tile.kind === "antenna") {
      const c = [row, col] as const;
      const cs = idx.get(tile.id);

      if (cs) {
        cs.push(c);
      } else {
        idx.set(tile.id, [c]);
      }
    }
  }

  return idx;
}

function* generatePairs(points: Point.RO[]): Generator<[Point.RO, Point.RO]> {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      yield [points[i], points[j]];
    }
  }
}

function writeAntinode(p: Point.RO, m: Matrix.RW<Tile>) {
  if (!Matrix.isInBounds(p, m)) {
    return;
  }

  const prevField = m[p[0]][p[1]];

  switch (prevField.kind) {
    case "empty": {
      m[p[0]][p[1]] = antinode;
      break;
    }
    case "antenna": {
      prevField.isAntinode = true;
      break;
    }
    case "antinode": {
      break;
    }
  }
}

function checkAntinode(
  p: Point.RO,
  antennasIdx: ReadonlyMap<string, Point.RO[]>,
  skipDistance: boolean = false,
): boolean {
  for (const [_, cs] of antennasIdx) {
    for (const [ant1, ant2] of generatePairs(cs)) {
      if (
        checkCollinear(p, ant1, ant2) &&
        (skipDistance ? true : checkAntinodeDistance(p, ant1, ant2))
      ) {
        return true;
      }
    }
  }
  return false;
}

function checkAntinodeDistance(
  p: Point.RO,
  a1: Point.RO,
  a2: Point.RO,
): boolean {
  const dist1 = calcDistance(p, a1);
  const dist2 = calcDistance(p, a2);
  return dist1 === 2 * dist2 || dist2 === 2 * dist1;
}

function checkCollinear(p1: Point.RO, p2: Point.RO, p3: Point.RO): boolean {
  // area of triangle
  return (
    p1[1] * (p2[0] - p3[0]) +
      p2[1] * (p3[0] - p1[0]) +
      p3[1] * (p1[0] - p2[0]) ===
    0
  );
}

function countAntinodes(m: Matrix.RO<Tile>): number {
  return m.reduce(
    (cnt, row) =>
      cnt +
      row.filter((f) => {
        switch (f.kind) {
          case "empty":
            return false;
          case "antinode":
            return true;
          case "antenna":
            return f.isAntinode;
        }
      }).length,
    0,
  );
}

function calcDistance(p1: Point.RO, p2: Point.RO): number {
  const deltaX = p1[0] - p2[0];
  const deltaY = p1[1] - p2[1];
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
