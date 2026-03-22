<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { retrieveClusterResult, runEffect } from '$lib/api-client';
	import { Effect } from 'effect';
	import Result from '../Result.svelte';

	let data = $derived(page.url.searchParams.get('data'));
	let workflowRes = $derived(
		!!data &&
			retrieveClusterResult(data).pipe(
				Effect.matchCause({
					onSuccess: (data) => ({ status: 'success' as const, data }),
					onFailure: (cause) => ({ status: 'error' as const, cause })
				}),
				runEffect.runPromise
			)
	);
</script>

<svelte:head><title>Scheduling Result</title></svelte:head>
{#if workflowRes}
	{#await workflowRes}
		Fetching Result
	{:then res}
		{#if res.status === 'success'}
			{@const solution = res.data}
			<Result {solution} onBack={() => goto('/')} />
		{:else}
			{res.cause.toString()}
		{/if}
	{/await}
{/if}
