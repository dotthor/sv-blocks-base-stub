// Example: Protected route with SSR
// src/routes/(protected)/dashboard/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // The user data comes from the handleAuth hook automatically
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // User is authenticated, load their data
    return {
        user: locals.user,
        // You can load additional user-specific data here
        // posts: await getUserPosts(locals.user.id),
        // notifications: await getUserNotifications(locals.user.id)
    };
};