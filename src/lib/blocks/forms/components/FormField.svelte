<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	// ... other input components

	interface Props {
		form: any; // Your superform instance
		formData: any; // Your form data store
		name: string;
		label?: string | false | null; // Optional: custom label, false/null to hide
		type?: 'text' | 'email' | 'password' | 'textarea' | 'checkbox';
		description?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		// Add more props as needed
	}

	let {
		form,
		formData,
		name,
		label,
		type = 'text',
		description,
		placeholder,
		required = false,
		disabled = false
	}: Props = $props();
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label !== false && label !== null}
				<Form.Label>
					{typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)}
				</Form.Label>
			{/if}
			{#if type === 'textarea'}
				<Textarea {...props} bind:value={$formData[name]} {placeholder} {disabled} {required} />
			{:else if type === 'checkbox'}
				<Checkbox {...props} bind:checked={$formData[name]} {disabled} {required} />
			{:else}
				<Input {...props} {type} bind:value={$formData[name]} {placeholder} {disabled} {required} />
			{/if}
		{/snippet}
	</Form.Control>

	{#if description}
		<Form.Description>{description}</Form.Description>
	{/if}

	<Form.FieldErrors />
</Form.Field>
