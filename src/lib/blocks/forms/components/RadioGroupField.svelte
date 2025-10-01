<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import type { BaseFormFieldProps } from '../types.js';
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
		legend = name.charAt(0).toUpperCase() + name.slice(1),
		withBackground = false,
		gridClass = 'col-span-full'
	}: Props = $props();
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
										: 'center'} w-full gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
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
	</Form.Fieldset>
</div>
