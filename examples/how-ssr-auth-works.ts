// Example: How the SSR hook provides authentication
// src/hooks.server.ts

import { handleAuth } from '$lib/auth-setup';
import type { Handle } from '@sveltejs/kit';

// This runs on EVERY request to your app
export const handle: Handle = handleAuth;

// What handleAuth does:
// 1. Checks for session cookie in the request
// 2. If cookie exists, validates it against the database
// 3. If session is valid, sets event.locals.user with user data
// 4. If session is invalid/expired, clears the cookie and sets locals.user = null
// 5. Continues to the route handler

// After this hook runs, every load function has access to:
// - locals.user (User object if authenticated, null if not)
// - locals.session (Session object if authenticated, null if not)

// This means you can protect routes like:
/*
export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }
    
    // User is definitely authenticated here
    return {
        user: locals.user
    };
};
*/