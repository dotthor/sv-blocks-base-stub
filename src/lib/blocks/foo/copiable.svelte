<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import IcoCopy from '@lucide/svelte/icons/copy';
	import IcoCheck from '@lucide/svelte/icons/check';

	let { data = 'banana' }: { data: string } = $props();

	let copied = $state(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(data);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	};
</script>

<Button
	onclick={handleCopy}
	variant="ghost"
	class="group relative flex w-fit items-center gap-2 rounded-lg p-2"
>
	<span class="">{data}</span>
	{#if copied}
		<IcoCheck class="size-4 animate-in text-green-500 duration-200 fade-in-0" />
		<span
			class="pointer-events-none absolute -top-3 -rotate-12 animate-in text-sm text-green-500 duration-200 fade-in-0"
		>
			Copied!
		</span>
	{:else}
		<IcoCopy class="invisible size-4 group-hover:visible" />
	{/if}
</Button>
