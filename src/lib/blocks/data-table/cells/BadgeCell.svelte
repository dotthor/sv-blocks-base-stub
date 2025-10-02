<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Component } from 'svelte';

	type Props = {
		value: string;
		variants?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>;
		icons?: Record<string, Component>;
		className?: string;
	};

	let { value, variants = {}, icons = {}, className = '' }: Props = $props();

	let variant = $derived(variants[value] || 'outline');
	let IconComponent = $derived(icons[value]);
</script>

<Badge {variant} class="px-1.5 text-muted-foreground {className}">
	{#if IconComponent}
		<IconComponent class="mr-1 h-3 w-3" />
	{/if}
	{value}
</Badge>
