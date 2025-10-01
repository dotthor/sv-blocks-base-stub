<script lang="ts">
	import { tick } from 'svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { useId } from 'bits-ui';
	import { MediaQuery } from 'svelte/reactivity';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { BaseFormFieldProps } from '../types';

	type Option = {
		label: string;
		value: string | number;
		disabled?: boolean;
	};

	type Props = BaseFormFieldProps & {
		options: Option[];
		placeholder?: string;
		searchPlaceholder?: string;
		emptyMessage?: string;
		width?: string;
		searchable?: boolean;
		breakpoint?: string;
	};

	let {
		form,
		formData,
		name,
		label,
		description,
		disabled,
		required = false,
		options,
		placeholder = 'Select option...',
		searchPlaceholder = 'Search...',
		emptyMessage = 'No option found.',
		width = 'w-[200px]',
		searchable = true,
		breakpoint = '(min-width: 768px)',
		gridClass = 'sm:col-span-3'
	}: Props = $props();

	let open = $state(false);
	const isDesktop = new MediaQuery(breakpoint);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();

	function selectOption(option: Option) {
		if (!option.disabled) {
			$formData[name] = option.value;
			open = false;
			// Focus the trigger button after selection for keyboard navigation
			tick().then(() => {
				document.getElementById(triggerId)?.focus();
			});
		}
	}
</script>

<div class={gridClass}>
	<Form.Field {form} {name} class="flex flex-col">
		{#if isDesktop.current}
			<!-- Desktop: Popover -->
			<Popover.Root bind:open>
				<Form.Control id={triggerId}>
					{#snippet children({ props })}
						{#if label !== false && label !== null}
							<Form.Label>
								{typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)}
								{#if required}<span class="ml-1 text-destructive">*</span>{/if}
							</Form.Label>
						{/if}
						<Popover.Trigger
							type="button"
							class={cn(
								buttonVariants({ variant: 'outline' }),
								width,
								'justify-between',
								!$formData[name] && 'text-muted-foreground',
								disabled && 'cursor-not-allowed opacity-50'
							)}
							role="combobox"
							{disabled}
							{...props}
						>
							{options.find((option) => option.value === $formData[name])?.label ?? placeholder}
							<ChevronsUpDownIcon class="opacity-50" />
						</Popover.Trigger>
						<input hidden value={$formData[name]} name={props.name} />
					{/snippet}
				</Form.Control>
				<Popover.Content class={cn(width, 'p-0')}>
					<Command.Root>
						{#if searchable}
							<Command.Input autofocus placeholder={searchPlaceholder} class="h-9" />
						{/if}
						<Command.Empty>{emptyMessage}</Command.Empty>
						<Command.Group>
							{#each options as option (option.value)}
								<Command.Item
									value={option.label}
									disabled={option.disabled}
									onSelect={() => selectOption(option)}
								>
									{option.label}
									<CheckIcon
										class={cn('ml-auto', option.value !== $formData[name] && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		{:else}
			<!-- Mobile: Command Dialog -->
			<Form.Control id={triggerId}>
				{#snippet children({ props })}
					{#if label !== false && label !== null}
						<Form.Label>
							{typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)}
							{#if required}<span class="ml-1 text-destructive">*</span>{/if}
						</Form.Label>
					{/if}
					<button
						type="button"
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-full justify-between',
							!$formData[name] && 'text-muted-foreground',
							disabled && 'cursor-not-allowed opacity-50'
						)}
						role="combobox"
						{disabled}
						onclick={() => (open = true)}
						{...props}
					>
						{options.find((option) => option.value === $formData[name])?.label ?? placeholder}
						<ChevronsUpDownIcon class="opacity-50" />
					</button>
					<input hidden value={$formData[name]} name={props.name} />
				{/snippet}
			</Form.Control>

			<Command.Dialog bind:open>
				{#if searchable}
					<Command.Input class="text-base" placeholder={searchPlaceholder} />
				{:else}
					<div class="h-4"></div>
				{/if}
				<Command.List>
					<Command.Empty>{emptyMessage}</Command.Empty>
					<Command.Group
						heading={typeof label === 'string'
							? label
							: name.charAt(0).toUpperCase() + name.slice(1)}
					>
						{#each options as option (option.value)}
							<Command.Item
								value={option.label}
								disabled={option.disabled}
								onSelect={() => selectOption(option)}
							>
								{option.label}
								<CheckIcon
									class={cn(
										'ml-auto h-4 w-4',
										option.value !== $formData[name] && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		{/if}
		{#if description && isDesktop.current}
			<Form.Description>{description}</Form.Description>
		{/if}
		<Form.FieldErrors />
	</Form.Field>
</div>
