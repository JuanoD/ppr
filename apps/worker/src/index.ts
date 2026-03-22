import { Effect, Layer, References } from "effect";
import { ClusterWorkflowEngine } from "effect/unstable/cluster";
import {
  BunRuntime,
  BunClusterSocket,
  BunServices,
} from "@effect/platform-bun";

import { DBEnvironment, PgLive } from "@ppr/db";
import { SolveStringWorkflow } from "@ppr/workflow";
import { solveEffect } from "@ppr/solver";

const RunnerLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provideMerge(
    BunClusterSocket.layer({ storage: "sql", shardingConfig: {} }),
  ),
  Layer.provideMerge(PgLive),
  Layer.provideMerge(DBEnvironment.layer),
);

const SolveStringWorkflowLayer = SolveStringWorkflow.toLayer(
  (payload, execId) =>
    Effect.logInfo(`Solving ${execId}`).pipe(
      Effect.andThen(() => solveEffect(payload.dzn)),
      Effect.catch((e) =>
        Effect.gen(function* () {
          yield* Effect.logError(e);
          return yield* Effect.fail(e.message);
        }),
      ),
      Effect.tap(() => Effect.logInfo(`Solved ${execId}`)),
    ),
);

const FullLayer = Layer.mergeAll(SolveStringWorkflowLayer).pipe(
  Layer.provideMerge(RunnerLayer),
  Layer.provideMerge(BunServices.layer),
  Layer.provide(Layer.succeed(References.MinimumLogLevel, "Info")),
  Layer.launch,
);

BunRuntime.runMain(FullLayer);
