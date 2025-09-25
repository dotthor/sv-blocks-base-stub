import type { RequestEvent } from '@sveltejs/kit';
import type { AuthUtils, User, Session } from '../server/core.js';

/**
 * Cookie management utilities for SSR apps
 */
export function createCookieHandlers(auth: AuthUtils) {
    function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
        event.cookies.set(auth.config.sessionCookieName, token, {
            expires: expiresAt,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    }

    function deleteSessionTokenCookie(event: RequestEvent) {
        event.cookies.delete(auth.config.sessionCookieName, {
            path: '/'
        });
    }

    function getSessionTokenFromCookie(event: RequestEvent): string | undefined {
        return event.cookies.get(auth.config.sessionCookieName);
    }

    return {
        setSessionTokenCookie,
        deleteSessionTokenCookie,
        getSessionTokenFromCookie
    };
}

/**
 * Creates reusable form actions for SSR apps
 */
export function createFormActions(auth: AuthUtils, db: any, userTable: any) {
    const { setSessionTokenCookie } = createCookieHandlers(auth);

    return {
        async login(event: RequestEvent) {
            const { fail, redirect } = await import('@sveltejs/kit');
            const { eq } = await import('drizzle-orm');

            const formData = await event.request.formData();
            const username = formData.get('username');
            const password = formData.get('password');

            if (!auth.validateUsername(username)) {
                return fail(400, {
                    message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
                });
            }
            if (!auth.validatePassword(password)) {
                return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
            }

            const results = await db.select().from(userTable).where(eq(userTable.username, username));
            const existingUser = results.at(0);

            if (!existingUser) {
                return fail(400, { message: 'Incorrect username or password' });
            }

            const validPassword = await auth.verifyPassword(existingUser.passwordHash, password);
            if (!validPassword) {
                return fail(400, { message: 'Incorrect username or password' });
            }

            const sessionToken = auth.generateSessionToken();
            const session = await auth.createSession(sessionToken, existingUser.id);
            setSessionTokenCookie(event, sessionToken, session.expiresAt);

            return redirect(302, auth.config.redirects.afterLogin);
        },

        async register(event: RequestEvent) {
            const { fail, redirect } = await import('@sveltejs/kit');

            const formData = await event.request.formData();
            const username = formData.get('username');
            const password = formData.get('password');

            if (!auth.validateUsername(username)) {
                return fail(400, { message: 'Invalid username' });
            }
            if (!auth.validatePassword(password)) {
                return fail(400, { message: 'Invalid password' });
            }

            const userId = auth.generateUserId();
            const passwordHash = await auth.hashPassword(password);

            try {
                await db.insert(userTable).values({ id: userId, username, passwordHash });
                const sessionToken = auth.generateSessionToken();
                const session = await auth.createSession(sessionToken, userId);
                setSessionTokenCookie(event, sessionToken, session.expiresAt);
            } catch {
                return fail(500, { message: 'An error has occurred' });
            }

            return redirect(302, auth.config.redirects.afterRegister);
        },

        async logout(event: RequestEvent) {
            const { redirect } = await import('@sveltejs/kit');
            const { deleteSessionTokenCookie, getSessionTokenFromCookie } = createCookieHandlers(auth);

            const sessionToken = getSessionTokenFromCookie(event);
            if (sessionToken) {
                const { session } = await auth.validateSessionToken(sessionToken);
                if (session) {
                    await auth.invalidateSession(session.id);
                }
            }

            deleteSessionTokenCookie(event);
            return redirect(302, auth.config.redirects.afterLogout);
        }
    };
}

/**
 * Creates a handle function for SSR apps
 */
export function createHandleAuth(auth: AuthUtils) {
    const { getSessionTokenFromCookie, setSessionTokenCookie, deleteSessionTokenCookie } = createCookieHandlers(auth);

    return async function handleAuth({ event, resolve }: { event: RequestEvent; resolve: any }) {
        const sessionToken = getSessionTokenFromCookie(event);

        if (!sessionToken) {
            event.locals.user = null;
            event.locals.session = null;
            return resolve(event);
        }

        const { session, user } = await auth.validateSessionToken(sessionToken);

        if (session) {
            setSessionTokenCookie(event, sessionToken, session.expiresAt);
        } else {
            deleteSessionTokenCookie(event);
        }

        event.locals.user = user;
        event.locals.session = session;
        return resolve(event);
    };
}