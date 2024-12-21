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

export function split<A>(arr: A[], splitter: A): A[][] {
  return arr.reduce((res: A[][], curr: A) => {
    if (curr === splitter) {
      res.push([]);
    } else {
      if (res.length === 0) {
        res.push([]);
      }
      res[res.length - 1].push(curr);
    }
    return res;
  }, []);
}

export function distinct<A>(arr: A[]): A[] {
  const set = new Set<string>();
  return arr.filter((v) => {
    const js = JSON.stringify(v);
    if (set.has(js)) {
      return false;
    }
    set.add(js);
    return true;
  });
}
