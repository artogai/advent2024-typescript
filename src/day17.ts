import { log } from "console";

const programStr = "2,4,1,3,7,5,1,5,0,3,4,2,5,5,3,0";
const program = programStr.split(",").map(Number);

part1();
part2();

function part1() {
  log(exec(BigInt(33024962)).join(","));
}

function part2() {
  let minSol = BigInt(Number.MAX_SAFE_INTEGER);
  for (const sol of solve(BigInt(0), program.length - 1)) {
    if (sol < minSol) {
      minSol = sol;
    }
  }
  log(minSol);
  log(exec(minSol).join(","));
}

function solve(a: bigint, i: number): bigint[] {
  if (i === -1) {
    return [a];
  }

  return Array.from({ length: 8 }, (_, j) => j).flatMap((j) => {
    const nextA = a === BigInt(0) ? BigInt(j) : (a << BigInt(3)) | BigInt(j);
    if (nextA !== BigInt(0) && checkDecompiled(nextA, i)) {
      return solve(nextA, i - 1);
    } else {
      return [];
    }
  });
}

function checkDecompiled(A: bigint, i: number): boolean {
  let B = BigInt(0);
  let C = BigInt(0);

  for (;;) {
    B = A % BigInt(8);
    B ^= BigInt(3);
    C = A / (BigInt(1) << B);
    B ^= BigInt(5);
    A = A >> BigInt(3);

    B = BigInt(B) ^ BigInt(C);

    if (program[i] !== Number(B % BigInt(8))) {
      return false;
    }

    i++;

    // A = 8 ^ 15 + x < 8 ^ 16
    if (A === BigInt(0)) {
      break;
    }
  }

  return i === program.length;
}

function exec(
  A: bigint,
  B: bigint = BigInt(0),
  C: bigint = BigInt(0),
): number[] {
  function combo(op: bigint): bigint {
    switch (op) {
      case BigInt(0):
      case BigInt(1):
      case BigInt(2):
      case BigInt(3):
        return op;
      case BigInt(4):
        return A;
      case BigInt(5):
        return B;
      case BigInt(6):
        return C;
      default:
        throw new Error("unsupported combo operand type");
    }
  }

  const out: number[] = [];
  let i = 0;

  while (i < program.length) {
    const op = BigInt(program[i]);
    const operand = BigInt(program[i + 1]);
    switch (op) {
      case BigInt(0): {
        A = A / (BigInt(1) << combo(operand));
        i += 2;
        break;
      }
      case BigInt(1): {
        B ^= operand;
        i += 2;
        break;
      }
      case BigInt(2): {
        B = combo(operand) % BigInt(8);
        i += 2;
        break;
      }
      case BigInt(3): {
        if (BigInt(A) === BigInt(0)) {
          i += 2;
        } else {
          i = Number(operand);
        }
        break;
      }
      case BigInt(4): {
        B ^= C;
        i += 2;
        break;
      }
      case BigInt(5): {
        out.push(Number(combo(operand) % BigInt(8)));
        i += 2;
        break;
      }
      case BigInt(6): {
        B = A / (BigInt(1) << combo(operand));
        i += 2;
        break;
      }
      case BigInt(7): {
        C = A / (BigInt(1) << combo(operand));
        i += 2;
        break;
      }
      default:
        throw new Error("unsupported operator type");
    }
  }

  return out;
}
