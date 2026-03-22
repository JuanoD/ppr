<script lang="ts">
	import { goto } from '$app/navigation';
	import InputForm from '$lib/components/InputForm.svelte';

	function handleSolve(data: string) {
		goto(`/result?data=${data}`);
	}
</script>

<svelte:head>
	<title>Scheduling</title>
</svelte:head>

<main class="mx-auto max-w-7xl">
	<InputForm onSolution={handleSolve} />
</main>
