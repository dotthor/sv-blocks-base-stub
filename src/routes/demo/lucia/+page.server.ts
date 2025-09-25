// src/routes/+layout.server.ts
import { formActions } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
	const user = locals.user;
	return { user };
};
export const actions: Actions = {
  logout: formActions.logout
};


