<script lang="ts">
	import { DialogResponsive, Grid } from '$lib/blocks/components';
	import Copiable from '$lib/blocks/foo/copiable.svelte';
	import {
		BaseForm,
		TextField,
		TextareaField,
		DynamicField,
		CheckableField,
		RadioGroupField
	} from '$lib/blocks/forms';
	import CalendarField from '$lib/blocks/forms/components/CalendarField.svelte';
	import ComboboxField from '$lib/blocks/forms/components/ComboboxField.svelte';
	import PasswordField from '$lib/blocks/forms/components/PasswordField.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { is } from 'drizzle-orm';
	import { formSchema, type FormSchema } from './schema';
	import SuperDebug, { type SuperValidated, type Infer } from 'sveltekit-superforms';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

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

	const notificationOptions = [
		{
			label: 'All new messages',
			value: 'all',
			description: 'Get notified for every new message'
		},
		{
			label: 'Direct messages and mentions',
			value: 'mentions',
			description: 'Only important notifications'
		},
		{
			label: 'Nothing',
			value: 'none',
			description: 'No notifications at all'
		}
	];
</script>

<BaseForm {data} schema={formSchema}>
	{#snippet children({ form, formData })}
		<!-- Username and Bio demonstrate different column spans -->
		<TextField {form} {formData} name="username" gridClass="sm:col-span-3" />
		<TextareaField {form} {formData} name="bio" gridClass="col-span-full" />

		<!-- Checkbox spanning full width -->
		<CheckableField
			{form}
			{formData}
			name="tos"
			label="Accept ToS and die!"
			description="Ciaoooooo"
			gridClass="col-span-full"
			withBackground
		/>

		<!-- Dialog with nested components using Grid component -->
		<DialogResponsive>
			{#snippet children()}
				<Grid>
					<DynamicField {form} {formData} name="skills" legend="Skills" />
					<CalendarField
						{form}
						{formData}
						name="birthdate"
						label="Birth Date"
						gridClass="col-span-2"
					/>
				</Grid>
			{/snippet}
		</DialogResponsive>

		<!-- Language selector in a smaller column -->
		<ComboboxField
			{form}
			{formData}
			name="language"
			options={languages}
			gridClass="sm:col-span-2"
		/>

		<RadioGroupField
			{form}
			{formData}
			options={notificationOptions}
			name="notifications"
			withBackground
			orientation="horizontal"
		/>
		<PasswordField />
		<Copiable data="+39 349 70 50 213" />
	{/snippet}
</BaseForm>
