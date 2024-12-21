import * as Matrix from "./utils/matrix.js";
import { log } from "console";
import { createHash } from "crypto";
import * as IO from "./utils/io.js";
import * as Point from "./utils/point.js";

const dim = [103, 101] as const;

type Robot = Readonly<{ id: number; velocity: Point.RO }>;

type Tile = Robot[];

part1();
part2();

function part1() {
  let m = parse(dim, "./input/day14.txt");
  for (let i = 0; i < 100; i++) {
    m = tick(m);
  }

  const res = getQuadrants(m)
    .map(countRobots)
    .reduce((acc, r) => acc * r);

  log(res);
}

function part2() {
  let m = parse(dim, "./input/day14.txt");

  for (let i = 0; i < 8149; i++) {
    m = tick(m);
  }

  log(show(m));
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
function part2Solution() {
  let m = parse(dim, "./input/day14.txt");
  const mHashes = new Set<string>();

  let tree = 69;
  const treeCycle = 101;

  for (let i = 0; i < 20000; i++) {
    const nextM = tick(m);
    const nextMStr = show(m);
    const nextHash = hash(nextMStr);
    if (mHashes.has(nextHash)) {
      break;
    }

    mHashes.add(nextHash);
    m = nextM;

    // find tree and treeCycle
    // if (i < 1000) {
    //   log(nextMStr);
    //   log(i);
    //   log("\n\n\n")
    // }

    if (i === tree) {
      log(nextMStr);
      log(i);
      log("\n\n\n");
      tree += treeCycle;
    }
  }
}

function tick(m: Matrix.RO<Tile>): Matrix.RW<Tile> {
  const nm = Matrix.createAs(m, () => []);

  for (const [tile, row, col] of Matrix.iter(m)) {
    for (const robot of tile) {
      move(robot, [row, col], nm);
    }
  }

  return nm;
}

function move(robot: Robot, from: Point.RO, m: Matrix.RW<Tile>) {
  const adjust = (coord: number, max: number): number => {
    return coord % max;
  };
  const [rows, cols] = Matrix.dim(m);

  const nextRow = adjust(from[0] + robot.velocity[0], rows);
  const nextCol = adjust(from[1] + robot.velocity[1], cols);

  const nextTile = m.at(nextRow)?.at(nextCol);
  if (nextTile === undefined) {
    log(nextRow, nextCol);
    throw Error("wrong tile");
  }
  nextTile.push(robot);
}

function countRobots(m: Matrix.RW<Tile>): number {
  let acc = 0;
  for (const [tile] of Matrix.iter(m)) {
    acc += tile.length;
  }
  return acc;
}

function getQuadrants<A>(m: Matrix.RO<A>): Matrix.RW<A>[] {
  const [rows, cols] = Matrix.dim(m);

  if (rows < 2 || cols < 2) return [];

  const midRow1 = Math.floor(rows / 2);
  const midCol1 = Math.floor(cols / 2);

  const midRow2 = rows % 2 === 0 ? midRow1 : midRow1 + 1;
  const midCol2 = cols % 2 === 0 ? midCol1 : midCol1 + 1;

  return [
    m.slice(0, midRow1).map((r) => r.slice(0, midCol1)),
    m.slice(0, midRow1).map((r) => r.slice(midCol2)),
    m.slice(midRow2).map((r) => r.slice(0, midCol1)),
    m.slice(midRow2).map((r) => r.slice(midCol2)),
  ];
}

function parse(dim: Point.RO, path: string): Matrix.RW<Tile> {
  const m = Matrix.create<Tile>(dim, () => []);

  IO.readLines(path)
    .map(parseRobotDesc)
    .forEach((robotDesc, i) => {
      const robot = {
        id: i + 1,
        velocity: robotDesc.velocity,
      };
      m.at(robotDesc.pos[0])?.at(robotDesc.pos[1])?.push(robot);
    });

  return m;
}

function parseRobotDesc(s: string): {
  pos: Point.RO;
  velocity: Point.RO;
} {
  const res = s.split(" ").map((part) => part.slice(2).split(",").map(Number));
  return {
    pos: [res[0][1], res[0][0]],
    velocity: [res[1][1], res[1][0]],
  };
}

function show(m: Matrix.RO<Tile>): string {
  return Matrix.show(m, (tile) => {
    if (tile.length === 0) {
      return ".";
    }
    return tile.length.toString();
  });
}

function hash(message: string): string {
  const hash = createHash("sha256");
  hash.update(message);
  return hash.digest("hex");
}
