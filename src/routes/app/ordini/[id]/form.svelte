<script lang="ts">
	import { TextField, CheckboxField, TextareaField, DynamicField } from '$lib/blocks/forms';
	import CalendarField from '$lib/blocks/forms/components/CalendarField.svelte';
	import ComboboxField from '$lib/blocks/forms/components/ComboboxField.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formSchema, type FormSchema } from './schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

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
		{ label: 'Chinese', value: 'zh' }
	];
</script>

<form method="POST" use:enhance>
	<TextField {form} {formData} name="username" />
	<TextareaField {form} {formData} name="bio" />
	<CheckboxField {form} {formData} name="tos" label="Accept ToS and die!" />
	<DynamicField {form} {formData} name="skills" />
	<CalendarField {form} {formData} name="birthdate" />
	<ComboboxField {form} {formData} name="language" options={languages} />

	<Form.Button>Submit</Form.Button>
</form>
<SuperDebug data={$formData}></SuperDebug>
