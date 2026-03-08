<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Result from '../Result.svelte';

	let data = $derived(page.url.searchParams.get('data'));
	let solution = $derived(data && atob(data));
</script>

<svelte:head><title>Scheduling Result</title></svelte:head>

<Result {solution} onBack={() => goto('/')} />
