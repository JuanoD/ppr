import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { cors } from "effect/unstable/http/HttpMiddleware";
import { HttpApiBuilder } from "effect/unstable/httpapi";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";

import { Api } from "@ppr/api";

import { solveEffect } from "./lib/solver";

const SchedulesHandlers = HttpApiBuilder.group(
  Api,
  "schedules",
  Effect.fn(function* (handlers) {
    return handlers.handle("solveString", ({ payload }) =>
      solveEffect(payload).pipe(
        Effect.map((data) => data.replace(/\r\n/g, "\n")),
        Effect.orDie,
      ),
    );
  }),
);

const ApiRoutes = HttpApiBuilder.layer(Api, {
  openapiPath: "/openapi.json",
}).pipe(Layer.provide(SchedulesHandlers));

const ServerLive = HttpRouter.serve(ApiRoutes, { middleware: cors() }).pipe(
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
);

Layer.launch(ServerLive).pipe(BunRuntime.runMain);
