<script lang="ts">
	let {
		increase,
		decrease,
		name,
		quantity
	}: { increase: () => void; decrease: () => void; name: string; quantity: number } = $props();
</script>

<div class="flex items-center gap-1">
	{name}
	<button class="p-2 text-xl" onclick={decrease}>
		-<span class="sr-only">Remove {name}</span>
	</button>
	<span>{quantity}</span>
	<button class="p-2 text-xl" onclick={increase}>
		+<span class="sr-only">Add {name}</span>
	</button>
</div>
