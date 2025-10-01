<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import type { BaseFormFieldProps } from '../types.js';

	type Props = BaseFormFieldProps & {
		type?: HTMLInputTypeAttribute;
	};

	let {
		form,
		formData,
		name,
		type = 'text',
		label,
		placeholder,
		description,
		disabled,
		required = false,
		gridClass = 'sm:col-span-3'
	}: Props = $props();
</script>

<div class={gridClass}>
	<Form.Field {form} {name}>
		<Form.Control>
			{#snippet children({ props })}
				{#if label !== false && label !== null}
					<Form.Label>
						{typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)}
					</Form.Label>
				{/if}

				<Input {...props} {type} bind:value={$formData[name]} {placeholder} {disabled} {required} />
			{/snippet}
		</Form.Control>

		{#if description}
			<Form.Description>{description}</Form.Description>
		{/if}

		<Form.FieldErrors />
	</Form.Field>
</div>
