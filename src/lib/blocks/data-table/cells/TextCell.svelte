<script lang="ts">
	type Props = {
		value: string;
		align?: 'left' | 'center' | 'right';
		className?: string;
	};

	let { value, align = 'left', className = '' }: Props = $props();

	let alignClass = $derived(
		align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
	);
</script>

<div class="flex items-center {alignClass} {className}">
	{value}
</div>
