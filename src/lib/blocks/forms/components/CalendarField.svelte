<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { BaseFormFieldProps } from '../types';

	type Props = BaseFormFieldProps & {
		description?: string;
	};

	let {
		form,
		formData,
		name,
		label,
		description,
		disabled,
		required = false,
		gridClass = 'sm:col-span-3'
	}: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $derived($formData.dob ? parseDate($formData.dob) : undefined);

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<div class={gridClass}>
	<Form.Field {form} name="dob" class="flex flex-col">
		<Form.Control>
			{#snippet children({ props })}
				{#if label !== false && label !== null}
					<Form.Label>
						{typeof label === 'string' ? label : name.charAt(0).toUpperCase() + name.slice(1)}
					</Form.Label>
				{/if}
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[280px] justify-start pl-4 text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							{disabled}
							type="single"
							value={value as DateValue}
							bind:placeholder
							minValue={new CalendarDate(1900, 1, 1)}
							maxValue={today(getLocalTimeZone())}
							calendarLabel="Date of birth"
							onValueChange={(v) => {
								if (v) {
									$formData.dob = v.toString();
								} else {
									$formData.dob = '';
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				{#if description}
					<Form.Description>{description}</Form.Description>
				{/if}

				<Form.FieldErrors />
				<input hidden value={$formData.dob} name={props.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>
</div>
