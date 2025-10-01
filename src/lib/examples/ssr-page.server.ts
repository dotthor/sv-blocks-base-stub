// +page.server.ts (SSR version)
import { formActions } from '$lib/auth-setup';
import type { Actions } from './$types';

export const actions: Actions = {
    login: formActions.login,
    register: formActions.register,
    logout: formActions.logout
};