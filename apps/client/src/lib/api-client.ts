import { Effect, flow, Layer, Schedule, ServiceMap, ManagedRuntime } from 'effect';
import { HttpApiClient } from 'effect/unstable/httpapi';
import { Api } from '@ppr/api';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/unstable/http';

export class ApiClient extends ServiceMap.Service<ApiClient, HttpApiClient.ForApi<typeof Api>>()(
	'ppr/ApiClient'
) {
	static readonly layer = Layer.effect(
		ApiClient,
		HttpApiClient.make(Api, {
			transformClient: (client) =>
				client.pipe(
					HttpClient.mapRequest(flow(HttpClientRequest.prependUrl('/api'))),
					HttpClient.retryTransient({
						schedule: Schedule.exponential(100),
						times: 3
					})
				)
		})
	).pipe(Layer.provide(FetchHttpClient.layer));
}

export const solve = (data: string) =>
	Effect.gen(function* () {
		const client = yield* ApiClient;

		const res = yield* client.schedules.solveString({
			payload: data
		});
		return res;
	});

export const runEffect = ManagedRuntime.make(ApiClient.layer);
