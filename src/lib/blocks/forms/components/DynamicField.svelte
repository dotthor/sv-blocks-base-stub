<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import IcoBin from '@lucide/svelte/icons/trash-2';
	import IcoPlus from '@lucide/svelte/icons/plus';
	import type { BaseFormFieldProps } from '../types.js';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	type FieldType = 'text' | 'email' | 'url' | 'number' | 'tel' | 'textarea';

	type Props = BaseFormFieldProps & {
		name: string; // Array field name (e.g., 'urls', 'skills', etc.)
		fieldType?: FieldType;
		legend?: string; // Legend text for the fieldset
		addButtonText?: string;
		itemDescription?: string; // Description for individual items
		defaultValue?: any; // Default value when adding new items
		minItems?: number;
		maxItems?: number;
		placeholder?: string;
		rows?: number; // For textarea type
	};

	let {
		form,
		formData,
		name,
		fieldType = 'text',
		legend = name.charAt(0).toUpperCase() + name.slice(1),
		addButtonText = `Add ${legend.slice(0, -1)}`, // Remove 's' from plural legend
		itemDescription,
		defaultValue = '',
		minItems = 0,
		maxItems = 20,
		placeholder,
		rows = 3
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

<Form.Fieldset {form} {name}>
	<Form.Legend>{legend}</Form.Legend>
	{#each $formData[name] as _, i}
		<Form.ElementField {form} name="{name}[{i}]">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex gap-2">
						<Form.Label class="sr-only">{legend.slice(0, -1)} {i + 1}</Form.Label>

						{#if fieldType === 'textarea'}
							<Textarea
								{...props}
								bind:value={$formData[name][i]}
								{placeholder}
								{rows}
								class="flex-1"
							/>
						{:else}
							<Input
								type={fieldType}
								{...props}
								bind:value={$formData[name][i]}
								{placeholder}
								class="flex-1"
							/>
						{/if}

						{#if canRemove()}
							<Button
								variant="destructive"
								size="icon"
								class="shrink-0"
								onclick={() => removeItemByIndex(i)}
							>
								<IcoBin />
							</Button>
						{/if}
					</div>
				{/snippet}
			</Form.Control>
			{#if itemDescription}
				<Form.Description class="sr-only">{itemDescription}</Form.Description>
			{/if}
		</Form.ElementField>
	{/each}
	<Form.FieldErrors />

	{#if canAdd()}
		<Button variant="outline" size="sm" onclick={addItem}>
			<IcoPlus />
			{addButtonText}
		</Button>
	{/if}
</Form.Fieldset>
