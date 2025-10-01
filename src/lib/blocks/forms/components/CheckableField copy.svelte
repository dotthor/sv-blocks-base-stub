<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import IcoBin from '@lucide/svelte/icons/trash-2';
	import IcoPlus from '@lucide/svelte/icons/plus';
	import type { BaseFormFieldProps } from '../types.js';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	type Option = {
		label: string;
		value: string;
		description?: string;
		disabled?: boolean;
	};

	type FieldType = 'text' | 'email' | 'url' | 'number' | 'tel' | 'textarea';

	type Props = BaseFormFieldProps & {
		options: Option[];
		name: string; // Array field name (e.g., 'urls', 'skills', etc.)
		fieldType?: FieldType;
		legend?: string; // Legend text for the fieldset
		addButtonText?: string;
		itemDescription?: string; // Description for individual items
		defaultValue?: any; // Default value when adding new items
		withBackground?: boolean;
		minItems?: number;
		maxItems?: number;
		placeholder?: string;
		rows?: number; // For textarea type
	};

	let {
		form,
		formData,
		name,
		options,
		fieldType = 'text',
		legend = name.charAt(0).toUpperCase() + name.slice(1),
		addButtonText = `Add ${legend.slice(0, -1)}`, // Remove 's' from plural legend
		itemDescription,
		description,
		defaultValue = '',
		withBackground = false,
		minItems = 1,
		maxItems = 20,
		placeholder,
		rows = 3,
		gridClass = 'col-span-full'
	}: Props = $props();

	function removeItemByIndex(index: number) {
		$formData[name] = $formData[name].filter((_: any, i: number) => i !== index);
	}

	function addItem() {
		if ($formData[name].length < maxItems) {
			$formData[name] = [...$formData[name], defaultValue];
		}
	}

	function canRemove() {
		return $formData[name].length > minItems;
	}

	function canAdd() {
		return $formData[name].length < maxItems;
	}
</script>

<div class={gridClass}>
	<Form.Fieldset {form} {name}>
		<Form.Legend>{legend}</Form.Legend>
		<RadioGroup.Root bind:value={$formData[name]} class="flex flex-col space-y-1" {name}>
			{#each options as option (option.value)}
				<div class="flex items-center space-y-0 space-x-3">
					<Form.Control>
						{#snippet children({ props })}
							{#if withBackground}
								<Form.Label
									class="flex items-{option.description
										? 'start'
										: 'center'} gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
								>
									<RadioGroup.Item disabled={option.disabled} value={option.value} {...props} />
									<div class="grid gap-1.5 font-normal">
										<p class="text-sm leading-none font-medium">{option.label}</p>
										{#if option.description}
											<p class="text-sm text-muted-foreground">{option.description}</p>
										{/if}
									</div></Form.Label
								>
							{:else}
								<RadioGroup.Item disabled={option.disabled} value={option.value} {...props} />
								<Form.Label class="font-normal">{option.label}</Form.Label>
							{/if}
						{/snippet}
					</Form.Control>
				</div>
			{/each}
		</RadioGroup.Root>
		<Form.FieldErrors />
		{#if canAdd()}
			<Button variant="outline" size="sm" onclick={addItem}>
				<IcoPlus />
				{addButtonText}
			</Button>
		{/if}
	</Form.Fieldset>
</div>
