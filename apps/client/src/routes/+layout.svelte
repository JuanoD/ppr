<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<h1 class="text-4xl p-8 text-center">Film Scheduling</h1>
{@render children()}
