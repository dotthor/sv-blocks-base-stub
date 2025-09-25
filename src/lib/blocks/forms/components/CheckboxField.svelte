<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import type { BaseFormFieldProps } from '../types.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	type Props = BaseFormFieldProps & {
		label: string; // Override to make label mandatory for checkboxes
		checked?: boolean;
		withBackground?: boolean;
	};

	let {
		form,
		formData,
		name,
		label,
		description,
		disabled,
		checked,
		required = false,
		withBackground = false
	}: Props = $props();
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if withBackground}
				<Form.Label
					class="flex items-{description
						? 'start'
						: 'center'} gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
				>
					<Checkbox
						{disabled}
						{required}
						{...props}
						bind:checked={$formData[name]}
						class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
					/>
					<div class="grid gap-1.5 font-normal">
						<p class="text-sm leading-none font-medium">{label}</p>
						{#if description}
							<p class="text-sm text-muted-foreground">{description}</p>
						{/if}
					</div>
				</Form.Label>
			{:else}
				<div class="flex items-{description ? 'start' : 'center'} gap-3">
					<Checkbox {disabled} {required} {...props} bind:checked={$formData[name]} />
					<div class="grid gap-2">
						<Form.Label>{label}</Form.Label>
						{#if description}
							<p class="text-sm text-muted-foreground">{description}</p>
						{/if}
					</div>
				</div>
			{/if}
		{/snippet}
	</Form.Control>

	<Form.FieldErrors />
</Form.Field>
