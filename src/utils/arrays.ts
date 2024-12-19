export function equal<A>(
  arr1: readonly A[],
  arr2: readonly A[],
  cmp?: (v1: A, v2: A) => boolean,
): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((val, idx) => (cmp ? cmp(val, arr2[idx]) : val === arr2[idx]))
  );
}
