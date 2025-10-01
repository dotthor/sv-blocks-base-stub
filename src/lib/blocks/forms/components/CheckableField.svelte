<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import type { BaseFormFieldProps } from '../types.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	type Props = BaseFormFieldProps & {
		label: string; // Override to make label mandatory for checkboxes
		checked?: boolean;
		withBackground?: boolean;
		style?: 'checkbox' | 'switch';
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
		withBackground = false,
		style = 'checkbox',
		gridClass = 'col-span-full'
	}: Props = $props();
</script>

<div class={gridClass}>
	<Form.Field {form} {name}>
		<Form.Control>
			{#snippet children({ props })}
				{#if withBackground}
					<Form.Label
						class="flex items-{description
							? 'start'
							: 'center'} gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5 has-[[aria-checked=true]]:ring-1 has-[[aria-checked=true]]:ring-primary/20"
					>
						{#if style === 'switch'}
							<Switch
								{disabled}
								{required}
								{...props}
								bind:checked={$formData[name]}
								class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
							/>
						{:else}
							<Checkbox
								{disabled}
								{required}
								{...props}
								bind:checked={$formData[name]}
								class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
							/>
						{/if}
						<div class="grid gap-1.5 font-normal">
							<p class="text-sm leading-none font-medium">{label}</p>
							{#if description}
								<p class="text-sm text-muted-foreground">{description}</p>
							{/if}
						</div>
					</Form.Label>
				{:else}
					<div class="flex items-{description ? 'start' : 'center'} gap-3">
						{#if style === 'switch'}
							<Switch {disabled} {required} {...props} bind:checked={$formData[name]} />
						{:else}
							<Checkbox {disabled} {required} {...props} bind:checked={$formData[name]} />
						{/if}
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
</div>
