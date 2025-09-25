<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	let { form, formData } = $props();
</script>

<Form.Field {form} name="username">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>Username</Form.Label>
			<Input {...props} bind:value={$formData.username} />
		{/snippet}
	</Form.Control>
	<Form.Description>This is your public display name.</Form.Description>
	<Form.FieldErrors />
</Form.Field>
