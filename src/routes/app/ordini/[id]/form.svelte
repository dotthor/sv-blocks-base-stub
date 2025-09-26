<script lang="ts">
	import DialogResponsive from '$lib/blocks/components/DialogResponsive.svelte';
	import { TextField, TextareaField, DynamicField, CheckableField } from '$lib/blocks/forms';
	import CalendarField from '$lib/blocks/forms/components/CalendarField.svelte';
	import ComboboxField from '$lib/blocks/forms/components/ComboboxField.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formSchema, type FormSchema } from './schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { SettingsIcon } from '@lucide/svelte/icons';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	const languages = [
		{ label: 'English', value: 'en' },
		{ label: 'French', value: 'fr' },
		{ label: 'German', value: 'de' },
		{ label: 'Spanish', value: 'es' },
		{ label: 'Portuguese', value: 'pt' },
		{ label: 'Russian', value: 'ru' },
		{ label: 'Japanese', value: 'ja' },
		{ label: 'Korean', value: 'ko' },
		{ label: 'Chinese', value: 'zh', disabled: true }
	];
</script>

<form method="POST" use:enhance>
	<TextField {form} {formData} name="username" />
	<TextareaField {form} {formData} name="bio" />
	<CheckableField {form} {formData} name="tos" label="Accept ToS and die!" />

	<DialogResponsive
		title="Settings"
		description="Configure your application settings."
		triggerText="Settings"
	>
		<!-- {#snippet trigger(props)}
			<Button variant="ghost" size="icon" {...props}>
				<SettingsIcon />
			</Button>
		{/snippet} -->

		{#snippet children()}
			<DynamicField {form} {formData} name="skills" />
			<CalendarField {form} {formData} name="birthdate" />
			<ComboboxField {form} {formData} name="language" options={languages} searchable={false} />
		{/snippet}
	</DialogResponsive>

	<Form.Button>Submit</Form.Button>
</form>
<SuperDebug data={$formData}></SuperDebug>
