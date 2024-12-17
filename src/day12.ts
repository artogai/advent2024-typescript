import { log } from "console";
import { readLines } from "./utils.js";

type Coord = readonly [number, number];

type Field = string[][];

type Mask = boolean[][];

type CornerPoint = {
  delta: Coord;
  isPlanted: boolean;
};

type Corner = CornerPoint[];

type CostFunc = (m: Readonly<Mask>) => number;

const DIRECTIONS: readonly Coord[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const BASE_CORNERS: readonly Corner[] = [
  // XX
  // X.
  [
    { delta: [0, 1], isPlanted: true },
    { delta: [1, 0], isPlanted: true },
    { delta: [1, 1], isPlanted: false },
  ],

  // X.
  // ..
  [
    { delta: [0, 1], isPlanted: false },
    { delta: [1, 0], isPlanted: false },
    { delta: [1, 1], isPlanted: false },
  ],
  // if both X are connected by bigger shape
  // X.
  // .X
  [
    { delta: [0, 1], isPlanted: false },
    { delta: [1, 0], isPlanted: false },
    { delta: [1, 1], isPlanted: true },
  ],
];

const CORNERS: readonly Corner[] = [
  ...BASE_CORNERS,
  ...BASE_CORNERS.map((c) => rotate90(c)),
  ...BASE_CORNERS.map((c) => rotate90(rotate90(c))),
  ...BASE_CORNERS.map((c) => rotate90(rotate90(rotate90(c)))),
];

const calcArea: CostFunc = (m) => {
  let area = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j]) {
        area += 1;
      }
    }
  }
  return area;
};

const calcPerimiter: CostFunc = (m) => {
  let perimiter = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j]) {
        perimiter += DIRECTIONS.map<[number, number]>((dir) => [
          i + dir[0],
          j + dir[1],
        ]).filter((c) => !isInBounds(c, m) || !m[c[0]][c[1]]).length;
      }
    }
  }
  return perimiter;
};

const calcCorners: CostFunc = (m) => {
  let corners = 0;
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j]) {
        CORNERS.forEach((points) => {
          if (points.every((p) => checkPoint([i, j], p, m))) {
            corners += 1;
          }
        });
      }
    }
  }
  return corners;
};

const part1Cost: CostFunc = (m) => calcArea(m) * calcPerimiter(m);
const part2Cost: CostFunc = (m) => calcArea(m) * calcCorners(m);

part(part1Cost);
part(part2Cost);

function part(cost: CostFunc) {
  const field = parseField("./input/day12.txt");
  const areas = genAreas(field);
  const res = areas.reduce((acc, a) => acc + cost(a), 0);
  log(res);
}

function parseField(path: string): Field {
  return readLines(path).map((line) => line.split(""));
}

function genAreas(f: Field): Mask[] {
  const areas: Mask[] = [];
  for (let i = 0; i < f.length; i++) {
    for (let j = 0; j < f[i].length; j++) {
      if (areas.some((area) => area[i][j])) {
        continue;
      }
      areas.push(traverseArea([i, j], f));
    }
  }
  return areas;
}

function traverseArea(start: Coord, f: Field): Mask {
  const mask = createEmptyMask(f);

  function rec(c: Coord) {
    mask[c[0]][c[1]] = true;

    DIRECTIONS.map<[number, number]>((dir) => [c[0] + dir[0], c[1] + dir[1]])
      .filter((nc) => isInBounds(nc, f))
      .filter((nc) => !mask[nc[0]][nc[1]])
      .filter((nc) => f[nc[0]][nc[1]] === f[c[0]][c[1]])
      .forEach(rec);
  }

  rec(start);

  return mask;
}

function checkPoint(c: Coord, p: CornerPoint, m: Readonly<Mask>): boolean {
  const row = c[0] + p.delta[0];
  const col = c[1] + p.delta[1];

  return isInBounds([row, col], m) ? p.isPlanted === m[row][col] : !p.isPlanted;
}

function createEmptyMask<A>(m: ReadonlyArray<ReadonlyArray<A>>): Mask {
  return m.map((row) => row.map((_) => false));
}

function isInBounds<A>(c: Coord, m: ReadonlyArray<ReadonlyArray<A>>): boolean {
  return c[0] >= 0 && c[0] < m.length && c[1] >= 0 && c[1] < m[0].length;
}

function rotate90(corner: Corner): Corner {
  return corner.map(({ delta, isPlanted }) => ({
    delta: [delta[1], -delta[0]],
    isPlanted,
  }));
}
