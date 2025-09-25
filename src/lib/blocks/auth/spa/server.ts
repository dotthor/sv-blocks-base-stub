import type { RequestEvent } from '@sveltejs/kit';
import type { AuthUtils, User, Session } from '../server/core.js';

/**
 * Creates API handlers for SPA apps
 */
export function createApiHandlers(auth: AuthUtils, db: any, userTable: any) {
    return {
        async login(event: RequestEvent) {
            const { json } = await import('@sveltejs/kit');
            const { eq } = await import('drizzle-orm');

            try {
                const { username, password } = await event.request.json();

                if (!auth.validateUsername(username)) {
                    return json({ error: 'Invalid username' }, { status: 400 });
                }
                if (!auth.validatePassword(password)) {
                    return json({ error: 'Invalid password' }, { status: 400 });
                }

                const results = await db.select().from(userTable).where(eq(userTable.username, username));
                const existingUser = results.at(0);

                if (!existingUser) {
                    return json({ error: 'Incorrect username or password' }, { status: 400 });
                }

                const validPassword = await auth.verifyPassword(existingUser.passwordHash, password);
                if (!validPassword) {
                    return json({ error: 'Incorrect username or password' }, { status: 400 });
                }

                const sessionToken = auth.generateSessionToken();
                const session = await auth.createSession(sessionToken, existingUser.id);

                // Set HTTP-only cookie for SPA
                event.cookies.set(auth.config.sessionCookieName, sessionToken, {
                    expires: session.expiresAt,
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });

                return json({
                    success: true,
                    user: { id: existingUser.id, username: existingUser.username }
                });
            } catch (error) {
                return json({ error: 'Invalid request' }, { status: 400 });
            }
        },

        async register(event: RequestEvent) {
            const { json } = await import('@sveltejs/kit');

            try {
                const { username, password } = await event.request.json();

                if (!auth.validateUsername(username)) {
                    return json({ error: 'Invalid username' }, { status: 400 });
                }
                if (!auth.validatePassword(password)) {
                    return json({ error: 'Invalid password' }, { status: 400 });
                }

                const userId = auth.generateUserId();
                const passwordHash = await auth.hashPassword(password);

                try {
                    await db.insert(userTable).values({ id: userId, username, passwordHash });
                    const sessionToken = auth.generateSessionToken();
                    const session = await auth.createSession(sessionToken, userId);

                    event.cookies.set(auth.config.sessionCookieName, sessionToken, {
                        expires: session.expiresAt,
                        path: '/',
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax'
                    });

                    return json({
                        success: true,
                        user: { id: userId, username }
                    });
                } catch {
                    return json({ error: 'User already exists' }, { status: 409 });
                }
            } catch (error) {
                return json({ error: 'Invalid request' }, { status: 400 });
            }
        },

        async logout(event: RequestEvent) {
            const { json } = await import('@sveltejs/kit');

            const sessionToken = event.cookies.get(auth.config.sessionCookieName);
            if (sessionToken) {
                const { session } = await auth.validateSessionToken(sessionToken);
                if (session) {
                    await auth.invalidateSession(session.id);
                }
            }

            event.cookies.delete(auth.config.sessionCookieName, { path: '/' });
            return json({ success: true });
        },

        async me(event: RequestEvent) {
            const { json } = await import('@sveltejs/kit');

            const sessionToken = event.cookies.get(auth.config.sessionCookieName);
            if (!sessionToken) {
                return json({ user: null }, { status: 401 });
            }

            const { session, user } = await auth.validateSessionToken(sessionToken);
            if (!session || !user) {
                event.cookies.delete(auth.config.sessionCookieName, { path: '/' });
                return json({ user: null }, { status: 401 });
            }

            // Renew cookie if session was extended
            event.cookies.set(auth.config.sessionCookieName, sessionToken, {
                expires: session.expiresAt,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            return json({ user });
        }
    };
}