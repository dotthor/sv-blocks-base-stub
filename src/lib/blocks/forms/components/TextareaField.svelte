<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import type { BaseFormFieldProps } from '../types.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	type Props = BaseFormFieldProps & {
		rows?: number;
		cols?: number;
		resize?: 'none' | 'vertical' | 'horizontal' | 'both';
	};

	let {
		form,
		formData,
		name,
		label,
		placeholder,
		description,
		disabled,
		required = false,
		rows,
		cols,
		resize = 'vertical',
		gridClass = 'col-span-full'
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

				<Textarea
					style="resize: {resize};"
					{...props}
					bind:value={$formData[name]}
					{placeholder}
					{disabled}
					{required}
					{cols}
					{rows}
				/>
			{/snippet}
		</Form.Control>

		{#if description}
			<Form.Description>{description}</Form.Description>
		{/if}

		<Form.FieldErrors />
	</Form.Field>
</div>
