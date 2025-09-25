// src/lib/auth-setup.ts
import { createAuth } from '$lib/blocks/auth';
import { createFormActions, createHandleAuth } from '$lib/blocks/auth/ssr';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Create the core auth utilities
export const auth = createAuth(db, table.user, table.session, {
	sessionCookieName: 'my-app-session',
	sessionDurationDays: 30,
	renewalThresholdDays: 15,
	redirects: {
		afterLogin: '/demo/lucia',
		afterRegister: '/demo/lucia',
		afterLogout: '/demo/lucia/login'
	}
});

// Create SSR-specific utilities
export const formActions = createFormActions(auth, db, table.user);
export const handleAuth = createHandleAuth(auth);