<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	type Props = {
		value: string | number;
		type?: 'text' | 'number';
		align?: 'left' | 'center' | 'right';
		className?: string;
		rowId: string | number;
		fieldKey: string;
		onSave?: (value: string | number) => Promise<void>;
	};

	let {
		value,
		type = 'text',
		align = 'left',
		className = '',
		rowId,
		fieldKey,
		onSave
	}: Props = $props();

	let alignClass = $derived(
		align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
	);

	let inputId = `${rowId}-${fieldKey}`;

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const newValue = formData.get(fieldKey) as string;

		if (onSave) {
			const processedValue = type === 'number' ? parseFloat(newValue) : newValue;
			await onSave(processedValue);
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<Label for={inputId} class="sr-only">{fieldKey}</Label>
	<Input
		name={fieldKey}
		id={inputId}
		{type}
		value={value?.toString() || ''}
		class="h-8 w-16 border-transparent bg-transparent shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30 {alignClass} {className}"
	/>
</form>
