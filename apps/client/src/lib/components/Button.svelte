<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant: 'red' | 'blue';
	}
	let { class: className, children, variant, ...props }: Props = $props();
</script>

<button
	{...props}
	class={[
		'rounded p-2 font-bold text-ctp-base',
		{
			'bg-ctp-red': variant === 'red',
			'bg-ctp-blue': variant === 'blue'
		},
		className
	]}
>
	{@render children?.()}
</button>
