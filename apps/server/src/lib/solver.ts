import { join } from "node:path";

import { Effect } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

const simpleModel = join(import.meta.dirname, "proyecto_pt1.mzn");
const complexModel = join(import.meta.dirname, "proyecto_pt2.mzn");

export const solveEffect = (data: string) =>
  Effect.gen(function* () {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
    const complex = /Evitar/.test(data);
    const model = complex ? complexModel : simpleModel;

    return yield* spawner.string(
      ChildProcess.make("minizinc", [
        model,
        "--time-limit",
        "300000",
        "-D",
        data.replaceAll(" ", ""),
      ]),
    );
  });
