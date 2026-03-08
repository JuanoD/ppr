<script lang="ts">
	import Coins from '@lucide/svelte/icons/coins';
	import Time from '@lucide/svelte/icons/timer';
	import type { Actor } from '$lib/form.svelte';

	let {
		actors,
		complex,
		toggleScene
	}: { actors: Actor[]; complex: boolean; toggleScene: (i: number, j: number) => void } = $props();
</script>

{#each actors as actor, actorIndex (actorIndex)}
	<div class="flex gap-4 p-3 not-last:border-b">
		<div class="flex min-w-80 gap-4">
			<input
				class="max-w-32 rounded bg-ctp-surface1 p-2"
				type="text"
				bind:value={actor.name}
				placeholder="Actor Name"
			/>

			<div class="flex gap-4">
				<label class="flex">
					<Coins aria-label="Payment" class="size-10 rounded-l bg-ctp-surface0 p-2" />
					<input
						class="w-12 rounded-r bg-ctp-surface1 p-2"
						type="number"
						bind:value={actor.payment}
						min="1"
					/>
				</label>

				{#if complex}
					<label class="flex">
						<Time aria-label="Availability" class="size-10 rounded-l bg-ctp-surface0 p-2" />
						<input
							class="w-12 rounded-r bg-ctp-surface1 p-2"
							type="number"
							bind:value={actor.availability}
							min="0"
						/>
					</label>
				{/if}
			</div>
		</div>

		<div class="flex gap-1 ml-auto">
			{#each actor.scenes as scene, sceneIndex (sceneIndex)}
				<button
					class={[
						'size-8 cursor-pointer rounded font-bold',
						scene ? 'bg-ctp-red text-ctp-base' : 'bg-ctp-overlay0'
					]}
					onclick={() => toggleScene(actorIndex, sceneIndex)}
				>
					<span class="sr-only">Scene</span>
					{sceneIndex + 1}
				</button>
			{/each}
		</div>
	</div>
{/each}
