<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';

	type Props = {
		// Content props
		title: string;
		description?: string;
		triggerText: string;

		// Behavior props
		open?: boolean;
		onOpenChange?: (open: boolean) => void;

		// Styling props
		triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
		triggerClass?: string;
		contentClass?: string;
		breakpoint?: string;

		// Slots/Snippets
		children?: Snippet;
		trigger?: Snippet<[any]>; // Receives props from Dialog/Drawer.Trigger
		footer?: Snippet;

		// Dialog specific
		dialogMaxWidth?: string;

		// Drawer specific
		drawerHeaderAlign?: 'left' | 'center';
	};

	let {
		title,
		description,
		triggerText,
		open = $bindable(false),
		onOpenChange,
		triggerVariant = 'outline',
		triggerSize = 'default',
		triggerClass = '',
		contentClass = '',
		breakpoint = '(min-width: 768px)',
		children,
		trigger,
		footer,
		dialogMaxWidth = 'sm:max-w-[425px]',
		drawerHeaderAlign = 'left'
	}: Props = $props();

	const isDesktop = new MediaQuery(breakpoint);

	// Handle open state changes
	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);
	}
</script>

{#if isDesktop.current}
	<Dialog.Root {open} onOpenChange={handleOpenChange}>
		{#if trigger}
			<Dialog.Trigger>
				{#snippet child({ props })}
					{@render trigger(props)}
				{/snippet}
			</Dialog.Trigger>
		{:else}
			<Dialog.Trigger
				type="button"
				class={buttonVariants({ variant: triggerVariant, size: triggerSize }) + ' ' + triggerClass}
			>
				{triggerText}
			</Dialog.Trigger>
		{/if}

		<Dialog.Content class={dialogMaxWidth + ' ' + contentClass}>
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
				{#if description}
					<Dialog.Description>{description}</Dialog.Description>
				{/if}
			</Dialog.Header>

			{#if children}
				{@render children()}
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root {open} onOpenChange={handleOpenChange}>
		{#if trigger}
			<Drawer.Trigger>
				{#snippet child({ props })}
					{@render trigger(props)}
				{/snippet}
			</Drawer.Trigger>
		{:else}
			<Drawer.Trigger
				type="button"
				class={buttonVariants({ variant: triggerVariant, size: triggerSize }) + ' ' + triggerClass}
			>
				{triggerText}
			</Drawer.Trigger>
		{/if}

		<Drawer.Content class={contentClass}>
			<Drawer.Header class="text-{drawerHeaderAlign}">
				<Drawer.Title>{title}</Drawer.Title>
				{#if description}
					<Drawer.Description>{description}</Drawer.Description>
				{/if}
			</Drawer.Header>

			{#if children}
				<div class="px-4">
					{@render children()}
				</div>
			{/if}

			{#if footer}
				<Drawer.Footer class="pt-2">
					{@render footer()}
				</Drawer.Footer>
			{:else}
				<Drawer.Footer class="pt-2">
					<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
				</Drawer.Footer>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
