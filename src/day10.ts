import { log } from "console";
import * as Arrays from "./utils/arrays";
import * as Matrix from "./utils/matrix";
import * as Direction from "./utils/direction";
import * as Point from "./utils/point";

const trailHead = 0;
const trailEnd = 9;

part1();
part2();

function part1() {
  const heights = Matrix.readFile("./input/day10.txt", (s) => Number(s));
  let scoresSum = 0;

  for (const [tile, row, col] of Matrix.iter(heights)) {
    if (tile === trailHead) {
      const ratings = calcRatings([row, col], heights);
      const score = countScore(ratings);
      scoresSum += score;
    }
  }

  log(scoresSum);
}

function part2() {
  const heights = Matrix.readFile("./input/day10.txt", (s) => Number(s));
  let ratingsSum = 0;

  for (const [v, row, col] of Matrix.iter(heights)) {
    if (v === trailHead) {
      const ratings = calcRatings([row, col], heights);
      const score = countRating(ratings);
      ratingsSum += score;
    }
  }

  log(ratingsSum);
}

function calcRatings(start: Point.RO, m: Matrix.RO<number>): Matrix.RW<number> {
  const queue: Point.RO[] = [];
  const counter = Matrix.createAs(m, () => 0);

  queue.push(start);

  while (queue.length != 0) {
    const pos = queue.shift()!;

    if (m[pos[0]][pos[1]] === trailEnd) {
      counter[pos[0]][pos[1]] += 1;
    }

    const adj = getAdjacent(pos, m);

    for (const nextPos of adj) {
      queue.push(nextPos);
    }
  }

  return counter;
}

function getAdjacent(pos: Point.RO, m: Matrix.RO<number>): Point.RW[] {
  return Direction.values
    .map<[number, number]>((dir) => Direction.move(pos, dir))
    .filter((pos) => Matrix.isInBounds(pos, m))
    .filter((node) => {
      const curr = m[pos[0]][pos[1]];
      const next = m[node[0]][node[1]];
      return next - curr === 1;
    });
}

function countScore(ratings: Matrix.RO<number>): number {
  return Arrays.sum(
    ratings.map((row) => Arrays.sum(row.map((r) => (r !== 0 ? 1 : 0)))),
  );
}

function countRating(ratings: Matrix.RO<number>): number {
  return Arrays.sum(ratings.map(Arrays.sum));
}
