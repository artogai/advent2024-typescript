import { PriorityQueue } from "js-sdsl";
import * as Matrix from "./matrix";
import * as Point from "./point";
import * as Arrays from "./arrays";
import * as Direction from "./direction";

export function dijkstra<Tile, Wall>(
  start: Point.RO,
  end: Point.RO,
  m: Matrix.RO<Tile | Wall>,
  wall: Wall,
): number {
  const dists = Matrix.createAs(m, () => Infinity);
  dists[start[0]][start[1]] = 0;

  const queue = new PriorityQueue(
    [[start, Number(0)] as const],
    (x, y) => x[1] - y[1],
  );

  while (queue.length > 0) {
    const [p, dist] = queue.pop()!;
    if (Arrays.equal(p, end)) return dist;

    Direction.values
      .map((dir) => Direction.move(p, dir))
      .filter((np) => Matrix.isInBounds(np, m) && m[np[0]][np[1]] !== wall)
      .forEach((np) => {
        const newDist = dist + 1;
        if (newDist < dists[np[0]][np[1]]) {
          dists[np[0]][np[1]] = newDist;
          queue.push([np, newDist]);
        }
      });
  }

  return -1;
}
