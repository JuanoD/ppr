import { Schema } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
} from "effect/unstable/httpapi";

export const SchedulesApi = HttpApiGroup.make("schedules").add(
  HttpApiEndpoint.post("solveString", "/string", {
    payload: Schema.String,
    success: Schema.String,
  }),
);

export const Api = HttpApi.make("ppr-api").add(
  SchedulesApi.prefix("/schedule"),
);
