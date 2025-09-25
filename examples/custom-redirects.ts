// Example: Custom redirect configuration
import { createAuth } from '$lib/blocks/auth';
import { createFormActions } from '$lib/blocks/auth/ssr';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Configure custom redirects
export const auth = createAuth(db, table.user, table.session, {
    redirects: {
        afterLogin: '/dashboard',        // Go to dashboard after login
        afterRegister: '/welcome',       // Go to welcome page after registration
        afterLogout: '/'                 // Go to home page after logout
    }
});

export const formActions = createFormActions(auth, db, table.user);