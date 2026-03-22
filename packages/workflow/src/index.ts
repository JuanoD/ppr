import { Schema } from "effect";
import { Workflow } from "effect/unstable/workflow";

export const SolveStringWorkflow = Workflow.make({
  name: "SolveStringWorkflow",
  success: Schema.String,
  error: Schema.String,
  payload: { dzn: Schema.String },
  idempotencyKey: (payload) => payload.dzn,
});
