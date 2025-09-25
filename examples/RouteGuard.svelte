<script>
	import { authStore } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let {
		redirectTo = '/login',
		requireAuth = true,
		loadingMessage = 'Checking authentication...',
		redirectingMessage = 'Redirecting to login...'
	} = $props();

	onMount(() => {
		if (requireAuth && !authStore.isAuthenticated && !authStore.loading) {
			// Preserve current URL for redirect after login
			const currentPath = encodeURIComponent($page.url.pathname + $page.url.search);
			goto(`${redirectTo}?redirectTo=${currentPath}`);
		}
	});
</script>

// Example: SPA Route Guard Component // src/lib/components/RouteGuard.svelte

{#if authStore.loading}
	<div class="loading">
		<p>{loadingMessage}</p>
	</div>
{:else if requireAuth && !authStore.isAuthenticated}
	<div class="redirecting">
		<p>{redirectingMessage}</p>
	</div>
{:else}
	<!-- User is authenticated, show protected content -->
	<slot />
{/if}

<style>
	.loading,
	.redirecting {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
	}
</style>
