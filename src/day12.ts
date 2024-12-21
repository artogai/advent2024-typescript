import { log } from "console";
import * as Point from "./utils/point.js";
import * as Matrix from "./utils/matrix.js";
import * as Direction from "./utils/direction.js";

type CornerPoint = Readonly<{
  delta: Point.RO;
  isPlanted: boolean;
}>;

type Corner = ReadonlyArray<CornerPoint>;

type CostFunc = (m: Matrix.RO<boolean>) => number;

const BASE_CORNERS: ReadonlyArray<Corner> = [
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

const CORNERS: ReadonlyArray<Corner> = [
  ...BASE_CORNERS,
  ...BASE_CORNERS.map((c) => rotate90(c)),
  ...BASE_CORNERS.map((c) => rotate90(rotate90(c))),
  ...BASE_CORNERS.map((c) => rotate90(rotate90(rotate90(c)))),
];

const calcArea: CostFunc = (m) => {
  let area = 0;
  for (const [v] of Matrix.iter(m)) {
    if (v) {
      area += 1;
    }
  }
  return area;
};

const calcPerimiter: CostFunc = (m) => {
  let perimiter = 0;
  for (const [v, row, col] of Matrix.iter(m)) {
    if (v) {
      perimiter += Direction.values
        .map<Point.RO>((dir) => Direction.move([row, col], dir))
        .filter((c) => !Matrix.isInBounds(c, m) || !m[c[0]][c[1]]).length;
    }
  }
  return perimiter;
};

const calcCorners: CostFunc = (m) => {
  let corners = 0;
  for (const [v, row, col] of Matrix.iter(m)) {
    if (v) {
      CORNERS.forEach((points) => {
        if (points.every((p) => checkPoint([row, col], p, m))) {
          corners += 1;
        }
      });
    }
  }
  return corners;
};

const part1Cost: CostFunc = (m) => calcArea(m) * calcPerimiter(m);
const part2Cost: CostFunc = (m) => calcArea(m) * calcCorners(m);

part(part1Cost);
part(part2Cost);

function part(costFunc: CostFunc) {
  const field = Matrix.readFile("./input/day12.txt", (s) => s);
  const areas = genAreas(field);
  const res = areas.reduce((acc, a) => acc + costFunc(a), 0);
  log(res);
}

function genAreas(m: Matrix.RO<string>): Matrix.RW<boolean>[] {
  const areas: Matrix.RW<boolean>[] = [];
  for (const [_, row, col] of Matrix.iter(m)) {
    if (areas.some((area) => area[row][col])) {
      continue;
    }
    areas.push(traverseArea([row, col], m));
  }
  return areas;
}

function traverseArea(
  start: Point.RO,
  m: Matrix.RO<string>,
): Matrix.RW<boolean> {
  const mask = Matrix.createAs(m, () => false);

  function rec(pos: Point.RO) {
    mask[pos[0]][pos[1]] = true;

    Direction.values
      .map((dir) => Direction.move(pos, dir))
      .filter((nc) => Matrix.isInBounds(nc, m))
      .filter((nc) => !mask[nc[0]][nc[1]])
      .filter((nc) => m[nc[0]][nc[1]] === m[pos[0]][pos[1]])
      .forEach(rec);
  }

  rec(start);

  return mask;
}

function checkPoint(
  p: Point.RO,
  c: CornerPoint,
  m: Matrix.RO<boolean>,
): boolean {
  const [row, col] = Point.move(p, c.delta);
  return Matrix.isInBounds([row, col], m)
    ? c.isPlanted === m[row][col]
    : !c.isPlanted;
}

function rotate90(corner: Corner): Corner {
  return corner.map(({ delta, isPlanted }) => ({
    delta: [delta[1], -delta[0]],
    isPlanted,
  }));
}
