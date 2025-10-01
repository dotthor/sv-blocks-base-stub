<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
		cols?: string; // Override default column configuration
		gap?: string; // Override default gap
	};

	let {
		children,
		class: className = '',
		cols = 'grid-cols-1 sm:grid-cols-6',
		gap = 'gap-x-6 gap-y-8'
	}: Props = $props();
</script>

<div class="grid {cols} {gap} {className}">
	{@render children()}
</div>
