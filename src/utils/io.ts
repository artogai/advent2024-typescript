import { readFileSync } from "fs";

export function readLines(path: string): string[] {
  const fileContent = readFileSync(path, "utf-8");
  return fileContent.split("\n");
}
