<script lang="ts">
	type Props = {
		value: number | string;
		currency?: string;
		locale?: string;
		align?: 'left' | 'center' | 'right';
		className?: string;
	};

	let {
		value,
		currency = 'USD',
		locale = 'en-US',
		align = 'right',
		className = ''
	}: Props = $props();

	let formatter = $derived(
		new Intl.NumberFormat(locale, {
			style: 'currency',
			currency
		})
	);

	let formattedValue = $derived(
		formatter.format(typeof value === 'string' ? parseFloat(value) : value)
	);

	let alignClass = $derived(
		align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
	);
</script>

<div class="font-medium {alignClass} {className}">
	{formattedValue}
</div>
