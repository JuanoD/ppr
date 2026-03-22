import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from "effect/unstable/httpapi";

export class NotFoundError extends Schema.TaggedErrorClass<NotFoundError>()(
  "NotFoundError",
  {},
) {}

export class SolveError extends Schema.TaggedErrorClass<SolveError>()(
  "SolveError",
  { message: Schema.String },
) {}

export class StillSolvingError extends Schema.TaggedErrorClass<StillSolvingError>()(
  "StillSolvingError",
  {},
) {}

export const SchedulesApi = HttpApiGroup.make("schedules").add(
  HttpApiEndpoint.post("solveString", "/string", {
    payload: Schema.String,
    success: Schema.String,
  }),
  HttpApiEndpoint.post("solveStringInWorkflow", "/string-wf", {
    payload: Schema.String,
    success: Schema.String,
  }),
  HttpApiEndpoint.get("getSolveResult", "/string-wf/:id", {
    params: { id: Schema.String },
    success: Schema.String,
    error: [
      NotFoundError.pipe(HttpApiSchema.status(404)),
      SolveError,
      StillSolvingError,
    ],
  }),
);

export const Api = HttpApi.make("ppr-api").add(
  SchedulesApi.prefix("/schedule"),
);
