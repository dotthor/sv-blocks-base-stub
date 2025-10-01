<script>
	import { Input } from '$lib/components/ui/input';
	import { Toggle } from '$lib/components/ui/toggle';
	import IcoEye from '@lucide/svelte/icons/eye';

	let pressed = $state(false);
</script>

<div class="relative">
	<Input class="pr-10" type={pressed ? 'text' : 'password'} />
	<Toggle bind:pressed class="absolute top-0 right-0 flex h-full w-10 items-center justify-center">
		<IcoEye />
	</Toggle>
</div>
