<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	type Props = {
		checked?: boolean;
		indeterminate?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		'aria-label'?: string;
		className?: string;
	};

	let {
		checked = false,
		indeterminate = false,
		onCheckedChange,
		'aria-label': ariaLabel = 'Select row',
		className = ''
	}: Props = $props();
</script>

<Checkbox {checked} {indeterminate} {onCheckedChange} aria-label={ariaLabel} class={className} />
