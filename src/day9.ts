import { log } from "console";
import { readFileSync } from "fs";

type Free = {
  kind: "free";
};

type File = {
  kind: "file";
  id: number;
};

type Block = Free | File;

type Disk = Block[];

type Sized = { size: number };

type FreeEncoded = Free & Sized;

type FileEncoded = File & Sized;

type BlockEncoded = FreeEncoded | FileEncoded;

type DiskMap = BlockEncoded[];

part1();
part2();

function part1() {
  const diskMap = parseDiskMap("./input/day9.txt");
  const disk = decode(diskMap);
  compactFiles(disk);
  const checksum = calcChecksum(disk);

  log(checksum);
}

function part2() {
  const diskMap = parseDiskMap("./input/day9.txt");
  compactWholeFiles(diskMap);
  const diskCompacted = decode(diskMap);
  const checksum = calcChecksum(diskCompacted);

  log(checksum);
}

function calcChecksum(disk: Disk): number {
  return disk.reduce((csum, block, i) => {
    switch (block.kind) {
      case "file":
        return csum + block.id * i;
      case "free":
        return csum;
    }
  }, 0);
}

function compactFiles(disk: Disk) {
  let i = 0;
  let j = disk.length - 1;

  while (i <= j) {
    while (disk[i].kind !== "free" && i < j) {
      i++;
    }
    while (disk[j].kind !== "file" && i < j) {
      j--;
    }

    const temp = disk[j];
    disk[j] = disk[i];
    disk[i] = temp;

    i++;
    j--;
  }
}

function compactWholeFiles(disk: DiskMap) {
  const moved = new Set<number>();
  let j = disk.length - 1;

  while (j > 0) {
    const block = disk[j];
    if (block.kind === "free" || moved.has(block.id)) {
      j--;
      continue;
    }

    for (let i = 0; i < j; i++) {
      if (disk[i].kind === "file") {
        continue;
      }

      const diff = disk[i].size - disk[j].size;

      if (diff >= 0) {
        disk[j] = { kind: "free", size: block.size };
        disk[i] = block;
        moved.add(block.id);

        if (diff > 0) {
          disk.splice(i + 1, 0, { kind: "free", size: diff });
        }

        break;
      }
    }

    j--;
  }
}

function decode(diskMap: DiskMap): Disk {
  return diskMap.flatMap((bEnc) =>
    new Array<Block>(bEnc.size).fill(toBlock(bEnc)),
  );
}

function parseDiskMap(path: string): DiskMap {
  return readFileSync(path, "utf-8")
    .split("")
    .map((c, i) => {
      const size = Number(c);

      if (i % 2 === 0) {
        return {
          kind: "file",
          id: Math.floor(i / 2),
          size,
        };
      } else {
        return {
          kind: "free",
          size,
        };
      }
    });
}

function toBlock(b: BlockEncoded): Block {
  switch (b.kind) {
    case "file":
      return { kind: b.kind, id: b.id };
    case "free":
      return { kind: b.kind };
  }
}
