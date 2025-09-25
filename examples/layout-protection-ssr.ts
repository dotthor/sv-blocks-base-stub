// Example: Layout-level protection (protects all child routes)
// src/routes/(protected)/+layout.server.ts

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    // Check if user is authenticated
    if (!locals.user) {
        // Preserve the original URL they were trying to access
        const redirectTo = encodeURIComponent(url.pathname + url.search);
        throw redirect(302, `/login?redirectTo=${redirectTo}`);
    }

    // Pass user data to all child routes
    return {
        user: locals.user
    };
};

// Now ALL routes under (protected)/ are automatically protected:
// - /dashboard -> protected
// - /profile -> protected  
// - /settings -> protected
// etc.