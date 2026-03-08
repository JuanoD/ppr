<script lang="ts">
	import type { Dislike } from '$lib/form.svelte';

	let {dislikes, actors}: { dislikes: Dislike[]; actors: string[] } = $props();
</script>

{#each dislikes as dislike, dislikeIdx (dislikeIdx)}
	<div class="flex items-center gap-3">
		<select class="flex-1 rounded bg-ctp-surface1 p-2" bind:value={dislike[0]}>
			<option value={undefined}>This person dislikes</option>
			{#each actors as actor, i (i)}
				<option value={actor}>{actor}</option>
			{/each}
		</select>
		<span>dislikes</span>
		<select class="flex-1 rounded bg-ctp-surface1 p-2" bind:value={dislike[1]}>
			<option value={undefined}>this other person</option>
			{#each actors as actor, i (i)}
				<option value={actor}>{actor}</option>
			{/each}
		</select>
	</div>
{/each}
