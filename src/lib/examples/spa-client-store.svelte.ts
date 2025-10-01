// src/lib/stores/auth.svelte.ts (SPA client-side)
import { createAuthStore } from '$lib/blocks/auth/spa';

export const authStore = createAuthStore();

// Auto-check auth on app start
if (typeof window !== 'undefined') {
    authStore.checkAuth();
}