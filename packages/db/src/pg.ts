import { PgClient } from "@effect/sql-pg";
import type {} from "effect/unstable/sql";
import {
  Config,
  Effect,
  identity,
  Layer,
  Redacted,
  Schema,
  SchemaTransformation,
  ServiceMap,
  String,
} from "effect";
import type { SqlClient } from "effect/unstable/sql/SqlClient";
import type { SqlError } from "effect/unstable/sql/SqlError";

const DBSchema = Schema.Union(
  [
    Schema.Struct({
      DB_URL: Schema.Redacted(Schema.NonEmptyString),
    }),
    Schema.Struct({
      DB_HOST: Schema.NonEmptyString,
      DB_PORT: Schema.Int,
      DB_NAME: Schema.NonEmptyString,
      DB_USER: Schema.NonEmptyString,
      DB_PASS: Schema.Redacted(Schema.NonEmptyString),
      DB_OPTS: Schema.optional(Schema.String), // Decode into a record to build search params for url
    }),
  ],
  { mode: "oneOf" },
).pipe(
  Schema.decodeTo(
    Schema.Redacted(Schema.String),
    SchemaTransformation.transform({
      decode: (input) => {
        if ("DB_URL" in input) return input.DB_URL;
        else
          return Redacted.make(
            `postgres://${input.DB_USER}:${Redacted.value(input.DB_PASS)}@${input.DB_HOST}:${input.DB_PORT}/${input.DB_NAME}?${input.DB_OPTS}`,
          );
      },
      encode: (input) => ({
        DB_URL: input,
      }),
    }),
  ),
);

export class DBEnvironment extends ServiceMap.Service<
  DBEnvironment,
  Schema.Schema.Type<typeof DBSchema>
>()("DBEnvironment", {
  make: Effect.gen(function* () {
    const result = yield* Schema.decodeEffect(DBSchema)({
      DB_URL: yield* Config.redacted("DB_URL").pipe(
        Config.withDefault(Redacted.make("")),
      ),
      DB_HOST: yield* Config.string("DB_HOST").pipe(Config.withDefault("")),
      DB_PORT: yield* Config.int("DB_PORT").pipe(Config.withDefault(5432)),
      DB_NAME: yield* Config.string("DB_NAME").pipe(Config.withDefault("")),
      DB_USER: yield* Config.string("DB_NAME").pipe(Config.withDefault("")),
      DB_PASS: yield* Config.redacted("DB_PASS").pipe(
        Config.withDefault(Redacted.make("")),
      ),
      DB_OPTS: yield* Config.string("DB_OPTS").pipe(Config.withDefault("")),
    });
    return result;
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}

export const PgLive = Layer.unwrap(
  Effect.gen(function* () {
    const dbUrl = yield* DBEnvironment;

    const pgClient = PgClient.layer({
      url: dbUrl,
      //ssl,
      transformQueryNames: String.camelToSnake,
      transformResultNames: String.snakeToCamel,
      // - 114: JSON (return as string instead of parsed object)
      // - 1082: DATE
      // - 1114: TIMESTAMP WITHOUT TIME ZONE
      // - 1184: TIMESTAMP WITH TIME ZONE
      // - 3802: JSONB (return as string instead of parsed object)
      /*
      types: {
        1082: {
          to: 25,
          from: [1082],
          parse: identity,
          serialize: identity,
        },
        1114: {
          to: 25,
          from: [1114],
          parse: identity,
          serialize: identity,
        },
        1184: {
          to: 25,
          from: [1184],
          parse: identity,
          serialize: identity,
        },
      },
      */
    });

    return pgClient;
  }),
);
