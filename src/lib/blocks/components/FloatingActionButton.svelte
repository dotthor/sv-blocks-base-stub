<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type Props = {
		// Button behavior
		type?: 'button' | 'submit' | 'reset';
		form?: string; // For associating with a form when type="submit"
		onclick?: () => void;
		disabled?: boolean;

		// Button styling
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg';

		// FAB specific styling
		class?: string;
		position?: 'bottom-center' | 'bottom-right' | 'bottom-left';
		offset?: string; // Custom positioning offset

		// Content
		children?: Snippet;
		text?: string;
		icon?: Snippet;

		// Behavior
		hideOnScroll?: boolean;
		zIndex?: string;
	};

	let {
		type = 'button',
		form,
		onclick,
		disabled = false,
		variant = 'default',
		size = 'lg',
		class: className = '',
		position = 'bottom-center',
		offset = '1rem', // 24px = 6 in Tailwind
		children,
		text,
		icon,
		hideOnScroll = false,
		zIndex = 'z-50'
	}: Props = $props();

	// Position classes based on position prop
	const positionClasses = {
		'bottom-center': 'left-1/2 -translate-x-1/2',
		'bottom-right': 'right-6',
		'bottom-left': 'left-6'
	};

	let isVisible = $state(true);
	let lastScrollY = $state(0);

	// Hide/show FAB on scroll if enabled
	function handleScroll() {
		if (!hideOnScroll) return;

		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			// Scrolling down & past threshold - hide FAB
			isVisible = false;
		} else {
			// Scrolling up or at top - show FAB
			isVisible = true;
		}

		lastScrollY = currentScrollY;
	}

	$effect(() => {
		if (hideOnScroll) {
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<div
	class={cn(
		'fixed transform transition-all duration-300',
		positionClasses[position],
		zIndex,
		isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
	)}
	style="bottom: {offset}"
>
	<Button
		{type}
		{form}
		{onclick}
		{disabled}
		{variant}
		{size}
		class={cn('h-14 rounded-4xl shadow-lg transition-shadow hover:shadow-xl', className)}
	>
		{#if children}
			{@render children()}
		{:else if icon}
			{@render icon()}
		{:else if text}
			{text.length <= 15 ? text : '✓'}
		{:else}
			✓
		{/if}
	</Button>
</div>
