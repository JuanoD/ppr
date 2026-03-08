<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { parseSolution } from '$lib/form.svelte';

	interface Props {
		solution: string | null;
		onBack: () => void;
	}

	let { solution, onBack }: Props = $props();
	let parsedSolution = $derived(solution && parseSolution(solution));

	let showString = $state(false);
</script>

{#if parsedSolution}
	<div class="mx-4 flex flex-col gap-4 rounded-lg bg-ctp-mantle p-6">
		<div class="gantt grid min-w-0 gap-x-1 gap-y-4 overflow-x-auto">
			{#each parsedSolution['orden_escenas'] as escena, i (escena)}
				<span
					class="col-start-(--start) col-end-(--end) row-start-1 rounded bg-ctp-lavender p-4 text-ctp-base"
					style:--start={parsedSolution['start_time'][escena - 1] + 1}
					style:--end={parsedSolution['end_time'][escena - 1] + 1}
				>
					{escena}
				</span>
			{/each}
			{#each parsedSolution['ACTORES'] as actor, i (actor)}
				<span
					class="col-start-(--start) col-end-(--end) row-start-(--row) rounded-full bg-ctp-teal p-2 text-ctp-base"
					style:--start={parsedSolution['actor_start_time'][i] + 1}
					style:--end={parsedSolution['actor_end_time'][i] + 1}
					style:--row={i + 2}
				>
					{actor}
				</span>
			{/each}
			{#if !solution}
				<p class="no-data">No timeline data available</p>
			{/if}
		</div>

		<Button variant="red" onclick={() => (showString = true)}>Show Solution String</Button>
		<Button variant="blue" onclick={onBack}>Back to Input</Button>
	</div>

	<Dialog class="min-w-2/3" onclose={() => (showString = false)} open={showString} closedby="any">
		<div class="flex flex-col gap-4">
			<h2 class="text-2xl font-bold">Solution</h2>
			<pre class="max-h-96 overflow-auto rounded-lg bg-ctp-crust p-4">{solution}</pre>
			<Button variant="blue" onclick={() => (showString = false)}>Close</Button>
		</div>
	</Dialog>
{/if}

<style>
	.gantt {
		grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
	}
</style>
