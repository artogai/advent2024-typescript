import { log } from "console";
import { readLines } from "./utils.js";

type Empty = { kind: "empty"; id: "." };
type Antenna = { kind: "antenna"; id: string; isAntinode: boolean };
type Antinode = { kind: "antinode"; id: "#" };

type Field = Empty | Antenna | Antinode;

type TerritoryMap = Field[][];

const empty: Empty = { kind: "empty", id: "." };
const antinode: Antinode = { kind: "antinode", id: "#" };

type Coord = {
  row: number;
  col: number;
};

part1();
part2();

function part1() {
  const m = parseMap("./input/day8.txt");
  const res = calcAntinodes(m);
  log(res);
}

function part2() {
  const m = parseMap("./input/day8.txt");
  const res = calcAntinodes(m, true);
  log(res);
}

function calcAntinodes(m: TerritoryMap, skipDistance: boolean = false): number {
  const antennasIdx = createAntennasIndex(m);

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      const c = { row: i, col: j };

      if (checkAntinode(c, antennasIdx, skipDistance)) {
        writeAntinode(c, m);
      }
    }
  }

  return countAntinodes(m);
}

function parseMap(path: string): TerritoryMap {
  return readLines(path).map((line) => {
    return line.split("").map((s) => {
      switch (s) {
        case ".":
          return empty;
        default:
          return { kind: "antenna", id: s, isAntinode: false };
      }
    });
  });
}

function createAntennasIndex(m: TerritoryMap): Map<string, Coord[]> {
  const idx = new Map<string, Coord[]>();

  for (let row = 0; row < m.length; row++) {
    for (let col = 0; col < m[row].length; col++) {
      const f = m[row][col];
      if (f.kind === "antenna") {
        const c = { col, row };
        const cs = idx.get(f.id);

        if (cs) {
          cs.push(c);
        } else {
          idx.set(f.id, [c]);
        }
      }
    }
  }

  return idx;
}

function* generatePairs(cs: readonly Coord[]): Generator<[Coord, Coord]> {
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      yield [cs[i], cs[j]];
    }
  }
}

function writeAntinode(c: Coord, m: TerritoryMap) {
  if (c.row < 0 || c.row >= m.length || c.col < 0 || c.col >= m[0].length) {
    return;
  }

  const prevField = m[c.row][c.col];

  switch (prevField.kind) {
    case "empty": {
      m[c.row][c.col] = antinode;
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
  c: Coord,
  antennasIdx: ReadonlyMap<string, Coord[]>,
  skipDistance: boolean = false,
): boolean {
  for (const [_, cs] of antennasIdx) {
    for (const [ant1, ant2] of generatePairs(cs)) {
      if (
        checkCollinear(c, ant1, ant2) &&
        (skipDistance ? true : checkAntinodeDistance(c, ant1, ant2))
      ) {
        return true;
      }
    }
  }
  return false;
}

function checkAntinodeDistance(c: Coord, a1: Coord, a2: Coord): boolean {
  const dist1 = calcDistance(c, a1);
  const dist2 = calcDistance(c, a2);
  return dist1 === 2 * dist2 || dist2 === 2 * dist1;
}

function checkCollinear(c1: Coord, c2: Coord, c3: Coord): boolean {
  // area of triangle
  return (
    c1.col * (c2.row - c3.row) +
      c2.col * (c3.row - c1.row) +
      c3.col * (c1.row - c2.row) ===
    0
  );
}

function countAntinodes(m: TerritoryMap): number {
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

function calcDistance(c1: Coord, c2: Coord): number {
  const deltaX = c1.row - c2.row;
  const deltaY = c1.col - c2.col;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
