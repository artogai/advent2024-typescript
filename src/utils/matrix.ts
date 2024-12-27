import * as Arrays from "./arrays";
import * as Point from "./point";
import * as IO from "./io";

export type RW<A> = A[][];
export type RO<A> = ReadonlyArray<ReadonlyArray<A>>;

export function copy<A>(m: RO<A>): RW<A> {
  return Array.from(m, (row) => Array.from(row));
}

export function create<A>(dim: Point.RO, defaultValue: () => A): RW<A> {
  return Array.from({ length: dim[0] }, () =>
    Array.from({ length: dim[1] }, defaultValue),
  );
}

export function createSquare<A>(dim: number, defaultValue: () => A): RW<A> {
  return create([dim, dim], defaultValue);
}

export function createAs<A, B>(m: RO<A>, defaultValue: () => B): RW<B> {
  return create(dim(m), defaultValue);
}

export function dim<A>(m: RO<A>): Point.RW {
  if (m.length === 0) return [0, 0];
  return [m.length, m[0].length];
}

export function* iter<A>(m: RO<A>) {
  for (let row = 0; row < m.length; row++) {
    for (let col = 0; col < m[row].length; col++) {
      yield [m[row][col], [row, col]] as [A, [number, number]];
    }
  }
}

export function isInBounds<A>(p: Point.RO, m: RO<A>): boolean {
  const [rows, cols] = dim(m);
  return p[0] >= 0 && p[0] < rows && p[1] >= 0 && p[1] < cols;
}

export function map<A, B>(m: RO<A>, f: (v: A, idx: Point.RO) => B): RW<B> {
  return m.map((arr, row) => arr.map((v, col) => f(v, [row, col])));
}

export function equal<A>(
  m1: RO<A>,
  m2: RO<A>,
  cmp?: (v1: A, v2: A) => boolean,
): boolean {
  return (
    Arrays.equal(dim(m1), dim(m2)) &&
    m1.every((arr1, row) => Arrays.equal(arr1, m2[row], cmp))
  );
}

export function find<A>(
  m: RO<A>,
  pred: (tile: A) => boolean,
): Point.RW | undefined {
  for (const [tile, p] of iter(m)) {
    if (pred(tile)) {
      return p;
    }
  }
}

export function show<A>(m: RO<A>, showA?: (tile: A) => string): string {
  return m
    .map((row) => row.map((v) => (showA ? showA(v) : String(v))).join(""))
    .join("\n");
}

export function parseLines<A>(
  lines: readonly string[],
  p: (s: string, row: number, col: number) => A,
): RW<A> {
  return lines.map((line, row) =>
    line.split("").map((s, col) => p(s, row, col)),
  );
}

export function parse<A>(
  s: string,
  p: (s: string, row: number, col: number) => A,
): RW<A> {
  return parseLines(s.split("\n"), p);
}

export function readFile<A>(
  path: string,
  p: (s: string, row: number, col: number) => A,
): RW<A> {
  return parseLines(IO.readLines(path), p);
}
