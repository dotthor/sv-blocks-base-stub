// src/lib/auth-setup.ts (SSR version)
import { createAuth } from '$lib/blocks/auth';
import { createFormActions, createHandleAuth } from '$lib/blocks/auth/ssr';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Create the core auth utilities
export const auth = createAuth(db, table.user, table.session, {
    sessionCookieName: 'my-app-session',
    sessionDurationDays: 7 // Shorter sessions
});

// Create SSR-specific utilities
export const formActions = createFormActions(auth, db, table.user);
export const handleAuth = createHandleAuth(auth);