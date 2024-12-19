import * as Arrays from "./arrays.js";

export type RW<A> = A[][];
export type RO<A> = ReadonlyArray<ReadonlyArray<A>>;

export function copy<A>(m: RO<A>): RW<A> {
  return Array.from(m, (row) => Array.from(row));
}

export function create<A>(
  dim: readonly [number, number],
  defaultValue: () => A,
): RW<A> {
  return Array.from({ length: dim[0] }, () =>
    Array.from({ length: dim[1] }, defaultValue),
  );
}

export function createSquare<A>(dim: number, defaultValue: () => A): RW<A> {
  return create([dim, dim], defaultValue);
}

export function createAs<A>(m: RO<A>, defaultValue: () => A): RW<A> {
  return create(dim(m), defaultValue);
}

export function dim<A>(m: RO<A>): [number, number] {
  if (m.length === 0) return [0, 0];
  return [m.length, m[0].length];
}

export function* iter<A>(m: RO<A>) {
  for (let row = 0; row < m.length; row++) {
    for (let col = 0; col < m[row].length; col++) {
      yield [m[row][col], row, col] as [A, number, number];
    }
  }
}

export function map<A, B>(
  m: RO<A>,
  f: (v: A, idx: [number, number]) => B,
): RW<B> {
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
