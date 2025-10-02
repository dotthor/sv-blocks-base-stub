<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DotsVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';

	type Props = {
		actions?: Array<'edit' | 'copy' | 'delete' | 'view'>;
		onEdit?: () => void;
		onCopy?: () => void;
		onDelete?: () => void;
		onView?: () => void;
		className?: string;
	};

	let {
		actions = ['edit', 'copy', 'delete'],
		onEdit,
		onCopy,
		onDelete,
		onView,
		className = ''
	}: Props = $props();

	function getActionHandler(action: string) {
		switch (action) {
			case 'edit':
				return onEdit;
			case 'copy':
				return onCopy;
			case 'delete':
				return onDelete;
			case 'view':
				return onView;
			default:
				return undefined;
		}
	}

	function getActionLabel(action: string) {
		switch (action) {
			case 'edit':
				return 'Edit';
			case 'copy':
				return 'Make a copy';
			case 'delete':
				return 'Delete';
			case 'view':
				return 'View details';
			default:
				return action;
		}
	}

	function isDestructive(action: string) {
		return action === 'delete';
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex size-8 text-muted-foreground data-[state=open]:bg-muted {className}"
	>
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<DotsVerticalIcon />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-32">
		{#each actions as action, index}
			{@const handler = getActionHandler(action)}
			{@const label = getActionLabel(action)}
			{@const destructive = isDestructive(action)}

			{#if index > 0 && action === 'delete'}
				<DropdownMenu.Separator />
			{/if}

			<DropdownMenu.Item variant={destructive ? 'destructive' : undefined} onclick={handler}>
				{label}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
