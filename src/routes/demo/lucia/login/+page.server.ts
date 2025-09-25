// src/routes/login/+page.server.ts
import { formActions } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	login: formActions.login,
	register: formActions.register
};