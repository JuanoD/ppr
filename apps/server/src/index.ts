import { Effect, Layer, Option } from "effect";
import { ClusterWorkflowEngine } from "effect/unstable/cluster";
import { HttpRouter } from "effect/unstable/http";
import { cors } from "effect/unstable/http/HttpMiddleware";
import { HttpApiBuilder } from "effect/unstable/httpapi";
import {
  BunClusterSocket,
  BunHttpServer,
  BunRuntime,
} from "@effect/platform-bun";

import { Api, NotFoundError, SolveError, StillSolvingError } from "@ppr/api";
import { PgLive, DBEnvironment } from "@ppr/db";
import { solveEffect } from "@ppr/solver";
import { SolveStringWorkflow } from "@ppr/workflow";

const SchedulesHandlers = HttpApiBuilder.group(
  Api,
  "schedules",
  Effect.fn(function* (handlers) {
    return handlers
      .handle("solveString", ({ payload }) =>
        solveEffect(payload).pipe(
          Effect.map((data) => data.replace(/\r\n/g, "\n")),
          Effect.orDie,
        ),
      )
      .handle("solveStringInWorkflow", ({ payload }) =>
        SolveStringWorkflow.execute({ dzn: payload }, { discard: true }).pipe(
          Effect.orDie,
        ),
      )
      .handle("getSolveResult", ({ params }) =>
        Effect.gen(function* () {
          const wfRes = yield* SolveStringWorkflow.poll(params.id);

          if (Option.isNone(wfRes)) return yield* new NotFoundError();
          const wfStatus = wfRes.value;

          if (wfStatus._tag === "Suspended")
            return yield* new StillSolvingError();

          if (wfStatus.exit._tag === "Failure")
            return yield* new SolveError({
              message: wfStatus.exit.cause.toString(),
            });

          const solution = wfStatus.exit.value;
          return solution;
        }).pipe(),
      );
  }),
);

const ApiRoutes = HttpApiBuilder.layer(Api, {
  openapiPath: "/openapi.json",
}).pipe(Layer.provide(SchedulesHandlers));

const ServerLive = HttpRouter.serve(ApiRoutes, { middleware: cors() }).pipe(
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
  Layer.provide(ClusterWorkflowEngine.layer),
  Layer.provide(
    BunClusterSocket.layer({
      clientOnly: true,
      storage: "sql",
      shardingConfig: {},
    }),
  ),
  Layer.provide(PgLive),
  Layer.provide(DBEnvironment.layer),
);

Layer.launch(ServerLive).pipe(BunRuntime.runMain);
