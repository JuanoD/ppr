<script lang="ts">
	import { runEffect, solve } from '$lib/api-client';
	import { buildDznString, FormState } from '$lib/form.svelte';
	import Quantity from './Quantity.svelte';
	import Scenes from './Scenes.svelte';
	import Actors from './Actors.svelte';
	import Dislikes from './Dislikes.svelte';
	import { Effect } from 'effect';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';
	import { variance } from 'd3';

	interface Props {
		onSolution: (data: string) => void;
	}
	let { onSolution }: Props = $props();

	let isLoading = $state(false);
	const formState = new FormState();
	let numActors = $derived(formState.actors.length);
	let numScenes = $derived(formState.scenes.length);
	let actorNames = $derived(formState.actors.map((v) => v.name));

	async function handleSubmit(inputString: string) {
		isLoading = true;
		try {
			await solve(inputString).pipe(
				Effect.tap((data) => Effect.succeed(onSolution(data))),
				runEffect.runPromise
			);
		} catch (err) {
			console.error('Error:', err);
			alert('An error occurred while solving');
		} finally {
			isLoading = false;
		}
	}

	let showStringModal = $state(false);
</script>

<div class="mx-4 flex flex-col gap-6 rounded-lg bg-ctp-mantle p-6">
	<div class="flex items-center gap-6">
		<Quantity
			name="Actors"
			quantity={numActors}
			decrease={formState.removeActor.bind(formState)}
			increase={formState.addActor.bind(formState)}
		/>

		<Quantity
			name="Scenes"
			quantity={numScenes}
			decrease={formState.removeScene.bind(formState)}
			increase={formState.addScene.bind(formState)}
		/>

		<div class="flex items-center gap-1">
			<input type="checkbox" id="complex" bind:checked={formState.complex} />
			<label for="complex">Complex mode (availability + dislikes)</label>
		</div>
	</div>

	<div class="">
		<h3 class="p-2 text-xl font-bold">Scene Lengths</h3>
		<Scenes scenes={formState.scenes} />
	</div>

	<div class="actors">
		<Actors
			actors={formState.actors}
			complex={formState.complex}
			toggleScene={formState.toggleScene.bind(formState)}
		/>
	</div>

	{#if formState.complex}
		<div class="flex flex-col gap-2 rounded-lg bg-[#11111b] p-4">
			<h3 class="text-xl font-bold">Actor Dislikes</h3>

			<Dislikes actors={actorNames} dislikes={formState.dislikes} />
			<div class="flex gap-4">
				<button class="success" onclick={() => formState.addDislike()}>+ Add</button>
				<button class="danger" onclick={() => formState.removeDislike()}>- Remove</button>
			</div>
		</div>
	{/if}

	<div class="flex gap-3">
		<Button
			variant="red"
			class="max-w-48 flex-1"
			onclick={() =>
				handleSubmit(
					buildDznString(formState.actors, formState.scenes, formState.dislikes, formState.complex)
				)}
			disabled={isLoading}
		>
			{isLoading ? 'Solving...' : 'Solve'}
		</Button>
		<Button variant="blue" class="max-w-48 flex-1" onclick={() => (showStringModal = true)}>
			Input String
		</Button>
	</div>
</div>

<Dialog open={isLoading}>
	<h2>Finding a solution...</h2>
	<p>Your problem is running on a constraint solver.</p>
	<div class="spinner"></div>
	<!-- <textarea class="w-full p-3 font-mono resize-y" disabled>{inputString}</textarea> -->
</Dialog>

<Dialog
	class="min-w-2/3"
	onclose={() => (showStringModal = false)}
	open={showStringModal}
	closedby="any"
>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const data = formData.get('data');
			if (typeof data === 'string') handleSubmit(data);
		}}
		class="flex flex-col gap-4"
	>
		<h2 class="text-xl font-bold">Paste your input</h2>
		<textarea name="data" class="w-full overflow-auto rounded-lg bg-ctp-crust p-4" rows="12"
		></textarea>
		<div class="flex gap-4">
			<Button variant="red" type="button" onclick={() => (showStringModal = false)}>Close</Button
			>
			<Button variant="blue">Submit</Button>
		</div>
	</form>
</Dialog>
