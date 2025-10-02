<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import type { Attachment } from 'svelte/attachments';

	type Props = {
		attach?: Attachment;
		className?: string;
	};

	let { attach, className = '' }: Props = $props();
</script>

<Button
	{@attach attach}
	variant="ghost"
	size="icon"
	class="size-7 text-muted-foreground hover:bg-transparent {className}"
>
	<GripVerticalIcon class="size-3 text-muted-foreground" />
	<span class="sr-only">Drag to reorder</span>
</Button>
