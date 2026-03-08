<script lang="ts">
	let { scenes }: { scenes: number[] } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each scenes as _, sceneIdx (sceneIdx)}
		<div class="flex items-center">
			<label class="rounded-l bg-ctp-surface0 p-2" for="length_{sceneIdx}">{sceneIdx + 1}</label>
			<input
				type="number"
				class="w-16 rounded-r bg-ctp-surface1 p-2"
				id="length_{sceneIdx}"
				bind:value={scenes[sceneIdx]}
				min="1"
			/>
		</div>
	{/each}
</div>
