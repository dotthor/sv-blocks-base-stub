<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Toggle } from '$lib/components/ui/toggle';
	import IcoEye from '@lucide/svelte/icons/eye';

	let pressed = $state(false);
</script>

<div class="relative">
	<Input class="pr-10" type={pressed ? 'text' : 'password'} />
	<div class="absolute top-0 right-0 h-full p-1">
		<Toggle bind:pressed class="flex h-full items-center justify-center">
			<IcoEye />
		</Toggle>
	</div>
</div>
