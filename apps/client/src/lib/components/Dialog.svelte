<script lang="ts">
	import type { Action } from 'svelte/action';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	let { children, open, class: className, ...props }: HTMLDialogAttributes = $props();

	type DialogOpenAction = Action<HTMLDialogElement, HTMLDialogAttributes['open']>;

	const dialogOpen: DialogOpenAction = (el, open) => {
		const update = (open: HTMLDialogAttributes['open']) => {
			if (open) el.showModal();
			else el.close();
		};
		update(open);

		return {
			update,
			destroy() {
				el.close();
			}
		};
	};
</script>

<dialog
	{...props}
	use:dialogOpen={open}
	class={[
		'm-auto rounded bg-ctp-base shadow p-4 text-ctp-text backdrop:bg-ctp-base/50 backdrop:backdrop-blur',
		className
	]}
>
	{@render children?.()}
</dialog>
