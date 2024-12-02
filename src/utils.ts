import { readFileSync } from "fs";

export function readLines(path: string): string[] {
  const fileContent = readFileSync(path, "utf-8");
  return fileContent.split("\n");
}

export function zip<A, B>(arr1: readonly A[], arr2: readonly B[]): [A, B][] {
  const arr: [A, B][] = [];
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    arr.push([arr1[i], arr2[i]]);
  }
  return arr;
}

export function unzip<A, B>(arr: readonly [A, B][]): [A[], B[]] {
  const arr1: A[] = [];
  const arr2: B[] = [];
  for (const v of arr) {
    arr1.push(v[0]);
    arr2.push(v[1]);
  }
  return [arr1, arr2];
}
