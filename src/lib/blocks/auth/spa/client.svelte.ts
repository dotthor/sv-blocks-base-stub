import { browser } from '$app/environment';
import type { User } from '../server/core.js';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

/**
 * Creates a reactive auth store for SPA apps using Svelte 5 runes
 */
export function createAuthStore() {
    let state = $state<AuthState>({
        user: null,
        loading: false,
        error: null
    });

    return {
        // Reactive getters
        get user() { return state.user; },
        get loading() { return state.loading; },
        get error() { return state.error; },
        get isAuthenticated() { return state.user !== null; },

        // Auth actions
        async login(username: string, password: string) {
            state.loading = true;
            state.error = null;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    state.user = data.user;
                    return { success: true };
                } else {
                    state.error = data.error;
                    return { success: false, error: data.error };
                }
            } catch (error) {
                const errorMessage = 'Network error';
                state.error = errorMessage;
                return { success: false, error: errorMessage };
            } finally {
                state.loading = false;
            }
        },

        async register(username: string, password: string) {
            state.loading = true;
            state.error = null;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    state.user = data.user;
                    return { success: true };
                } else {
                    state.error = data.error;
                    return { success: false, error: data.error };
                }
            } catch (error) {
                const errorMessage = 'Network error';
                state.error = errorMessage;
                return { success: false, error: errorMessage };
            } finally {
                state.loading = false;
            }
        },

        async logout() {
            state.loading = true;
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                state.user = null;
                state.loading = false;
                state.error = null;
            }
        },

        async checkAuth() {
            if (!browser) return;

            state.loading = true;
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    state.user = data.user;
                } else {
                    state.user = null;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                state.user = null;
            } finally {
                state.loading = false;
            }
        },

        // Manual state setters (for edge cases)
        setUser(user: User | null) {
            state.user = user;
        },

        setError(error: string | null) {
            state.error = error;
        },

        clearError() {
            state.error = null;
        }
    };
}

export type AuthStore = ReturnType<typeof createAuthStore>;