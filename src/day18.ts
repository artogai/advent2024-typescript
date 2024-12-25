import { log } from "console";
import { readLines } from "./utils/io";
import * as Point from "./utils/point";
import * as Matrix from "./utils/matrix";
import { dijkstra } from "./utils/path";

part1();
part2();

type Tile = "." | "#";

function part1() {
  const m = Matrix.createSquare<Tile>(71, () => ".");
  const points = parse("./input/day18.txt");
  for (const p of points.slice(0, 1024)) {
    m[p[0]][p[1]] = "#";
  }

  log(dijkstra([0, 0], [70, 70], m, "#"));
}

function part2() {
  const m = Matrix.createSquare<Tile>(71, () => ".");
  const points = parse("./input/day18.txt");
  for (const p of points) {
    m[p[0]][p[1]] = "#";
    if (dijkstra([0, 0], [70, 70], m, "#") === -1) {
      log([p[1], p[0]].join(","));
      break;
    }
  }
}

function parse(path: string): Point.RW[] {
  return readLines(path)
    .map((s) => s.split(",").map(Number))
    .map((p) => [p[1], p[0]] as const);
}
