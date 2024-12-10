import { log } from "console";
import { arraySum, readLines } from "./utils.js";

const TRAIL_HEAD = 0;
const TRAIL_END = 9;
const DIRECTIONS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

part1();
part2();

function part1() {
  const heights = parse("./input/day10.txt");
  let scoresSum = 0;

  for (const node of nodes(heights)) {
    if (isTrailHead(node, heights)) {
      const ratings = calcRatings(node, heights);
      const score = countScore(ratings);
      scoresSum += score;
    }
  }

  log(scoresSum);
}

function part2() {
  const heights = parse("./input/day10.txt");
  let ratingsSum = 0;

  for (const node of nodes(heights)) {
    if (isTrailHead(node, heights)) {
      const ratings = calcRatings(node, heights);
      const score = countRating(ratings);
      ratingsSum += score;
    }
  }

  log(ratingsSum);
}

function* nodes(graph: number[][]): Generator<[number, number]> {
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      yield [i, j];
    }
  }
}

function calcRatings(
  start: readonly [number, number],
  graph: readonly number[][],
): number[][] {
  let queue: (readonly [number, number])[] = [];
  const counter: number[][] = graph.map((row) => row.map((_) => 0));

  queue.push(start);

  while (queue.length != 0) {
    const [node, ...tail] = queue;

    if (graph[node[0]][node[1]] === TRAIL_END) {
      counter[node[0]][node[1]] += 1;
    }

    const adj = getAdjacent(node, graph);

    for (const nextNode of adj) {
      tail.push(nextNode);
    }

    queue = tail;
  }

  return counter;
}

function getAdjacent(
  head: readonly [number, number],
  graph: readonly number[][],
): [number, number][] {
  return DIRECTIONS.map<[number, number]>((dir) => [
    head[0] + dir[0],
    head[1] + dir[1],
  ])
    .filter((node) => {
      return (
        node[0] >= 0 &&
        node[0] < graph.length &&
        node[1] >= 0 &&
        node[1] < graph[node[0]].length
      );
    })
    .filter((node) => {
      const curr = graph[head[0]][head[1]];
      const next = graph[node[0]][node[1]];
      return next - curr === 1;
    });
}

function countScore(ratings: readonly number[][]): number {
  return arraySum(
    ratings.map((row) => arraySum(row.map((r) => (r !== 0 ? 1 : 0)))),
  );
}

function countRating(ratings: readonly number[][]): number {
  return arraySum(ratings.map((row) => arraySum(row)));
}

function isTrailHead(node: [number, number], heights: number[][]): boolean {
  return heights[node[0]][node[1]] === TRAIL_HEAD;
}

function parse(path: string): number[][] {
  return readLines(path).map((line) => line.split("").map(Number));
}
