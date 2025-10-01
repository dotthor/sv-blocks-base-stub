<script lang="ts">
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { MediaQuery } from 'svelte/reactivity';
	import * as Form from '$lib/components/ui/form/index.js';
	import FloatingActionButton from '$lib/blocks/components/FloatingActionButton.svelte';
	import type { Snippet } from 'svelte';
	import type { ZodSchema } from 'zod';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type Props<T extends ZodSchema> = {
		// Required props
		data: { form: SuperValidated<Infer<T>> };
		schema: T;

		// Content snippets
		children: Snippet<[{ form: any; formData: any }]>; // Form fields
		actions?: Snippet<[{ form: any; formData: any }]>; // Custom actions/buttons

		// Form configuration
		superFormConfig?: Parameters<typeof superForm>[1]; // This should give us the full config type
		method?: HTMLFormAttributes['method'];
		action?: string;
		enctype?: HTMLFormAttributes['enctype'];

		// UI options
		submitText?: string;
		showSubmitButton?: boolean;
		submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		submitSize?: 'default' | 'sm' | 'lg' | 'icon';

		// Layout options
		gridLayout?: boolean;

		// Mobile FAB options
		mobileFAB?: boolean;
		breakpoint?: string;

		// Debug
		debug?: boolean;

		// Form styling
		class?: string;
	};

	let {
		data,
		schema,
		children,
		actions,
		superFormConfig = {},
		method = 'POST',
		action,
		enctype,
		submitText = 'Submit',
		showSubmitButton = true,
		submitVariant = 'default',
		submitSize = 'default',
		gridLayout = true,
		mobileFAB = true,
		breakpoint = '(min-width: 768px)',
		debug = false,
		class: className = ''
	}: Props<any> = $props();

	// Merge default config with user config
	const defaultConfig = {
		validators: zodClient(schema),
		...superFormConfig
	};

	const form = superForm(data.form, defaultConfig);
	const { form: formData, enhance } = form;

	const isDesktop = new MediaQuery(breakpoint);

	// Generate unique form ID for FAB association
	let formId = `form-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="relative">
	<form id={formId} {method} {action} {enctype} use:enhance class={className}>
		{#if gridLayout}
			<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				{@render children({ form, formData })}
			</div>
		{:else}
			{@render children({ form, formData })}
		{/if}

		{#if actions}
			{@render actions({ form, formData })}
		{:else if showSubmitButton}
			{#if isDesktop.current || !mobileFAB}
				<!-- Desktop: Normal submit button -->
				<Form.Button variant={submitVariant} size={submitSize}>
					{submitText}
				</Form.Button>
			{:else}
				<!-- Mobile: Add bottom padding to prevent content from being hidden by FAB -->
				<div class="pb-20"></div>
			{/if}
		{/if}
	</form>

	{#if showSubmitButton && !actions && !isDesktop.current && mobileFAB}
		<!-- Mobile: Floating Action Button -->
		<FloatingActionButton type="submit" form={formId} variant={submitVariant} text={submitText} />
	{/if}
</div>

{#if debug}
	<!-- Note: Import SuperDebug in your page if you want to use debug -->
	<div class="mt-4 rounded-lg bg-gray-100 p-4">
		<pre class="overflow-auto text-xs">{JSON.stringify($formData, null, 2)}</pre>
	</div>
{/if}
