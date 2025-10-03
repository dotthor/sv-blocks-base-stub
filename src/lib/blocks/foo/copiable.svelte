<!-- <script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let { data = 'banana' }: { data: string } = $props();
	import IcoCopy from '@lucide/svelte/icons/copy';
</script>

<Button
	onclick={() => navigator.clipboard.writeText(data)}
	variant="ghost"
	class="group flex w-fit items-center gap-2 rounded-lg p-2"
>
	<span class="">{data}</span>
	<IcoCopy class="hidden size-4 group-hover:inline" />
</Button> -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let { data = 'banana' }: { data: string } = $props();
	import IcoCopy from '@lucide/svelte/icons/copy';
	import IcoCheck from '@lucide/svelte/icons/check';

	let copied = $state(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(data);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	};
</script>

<Button
	onclick={handleCopy}
	variant="ghost"
	class="group flex w-fit items-center gap-2 rounded-lg p-2"
>
	<span class="">{data}</span>
	{#if copied}
		<IcoCheck class="size-4 animate-in text-green-500 duration-200 fade-in-0" />
	{:else}
		<IcoCopy class="hidden size-4 group-hover:inline" />
	{/if}
</Button>

{#if copied}
	<span
		class="pointer-events-none absolute ml-2 animate-in text-sm text-green-500 duration-200 fade-in-0"
	>
		Copied!
	</span>
{/if}
