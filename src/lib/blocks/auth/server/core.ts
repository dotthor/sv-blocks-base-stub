import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';

// Types that both SSR and SPA need
export interface User {
    id: string;
    username: string;
}

export interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
}

export interface SessionValidationResult {
    session: Session | null;
    user: User | null;
}

export interface AuthConfig {
    sessionCookieName?: string;
    sessionDurationDays?: number;
    renewalThresholdDays?: number;
    redirects?: {
        afterLogin?: string;
        afterRegister?: string;
        afterLogout?: string;
    };
    argon2Config?: {
        memoryCost: number;
        timeCost: number;
        outputLen: number;
        parallelism: number;
    };
}

interface RequiredAuthConfig extends Required<AuthConfig> {
    redirects: Required<NonNullable<AuthConfig['redirects']>>;
    argon2Config: Required<NonNullable<AuthConfig['argon2Config']>>;
}

const DEFAULT_CONFIG: RequiredAuthConfig = {
    sessionCookieName: 'auth-session',
    sessionDurationDays: 30,
    renewalThresholdDays: 15,
    redirects: {
        afterLogin: '/dashboard',
        afterRegister: '/dashboard',
        afterLogout: '/login'
    },
    argon2Config: {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    }
};

/**
 * Creates auth utilities with configurable options
 */
export function createAuth(
    db: any,
    userTable: any,
    sessionTable: any,
    config: AuthConfig = {}
) {
    const mergedConfig: RequiredAuthConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        redirects: { ...DEFAULT_CONFIG.redirects, ...config.redirects },
        argon2Config: { ...DEFAULT_CONFIG.argon2Config, ...config.argon2Config }
    };
    const DAY_IN_MS = 1000 * 60 * 60 * 24;

    function generateSessionToken(): string {
        const bytes = crypto.getRandomValues(new Uint8Array(18));
        return encodeBase64url(bytes);
    }

    function generateUserId(): string {
        const bytes = crypto.getRandomValues(new Uint8Array(15));
        return encodeBase32LowerCase(bytes);
    }

    async function createSession(token: string, userId: string): Promise<Session> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session: Session = {
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + DAY_IN_MS * mergedConfig.sessionDurationDays)
        };
        await db.insert(sessionTable).values(session);
        return session;
    }

    async function validateSessionToken(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const [result] = await db
            .select({
                user: { id: userTable.id, username: userTable.username },
                session: sessionTable
            })
            .from(sessionTable)
            .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
            .where(eq(sessionTable.id, sessionId));

        if (!result) {
            return { session: null, user: null };
        }

        const { session, user } = result;

        // Check if session expired
        const sessionExpired = Date.now() >= session.expiresAt.getTime();
        if (sessionExpired) {
            await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
            return { session: null, user: null };
        }

        // Renew session if needed
        const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * mergedConfig.renewalThresholdDays;
        if (renewSession) {
            session.expiresAt = new Date(Date.now() + DAY_IN_MS * mergedConfig.sessionDurationDays);
            await db
                .update(sessionTable)
                .set({ expiresAt: session.expiresAt })
                .where(eq(sessionTable.id, session.id));
        }

        return { session, user };
    }

    async function invalidateSession(sessionId: string): Promise<void> {
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    }

    async function hashPassword(password: string): Promise<string> {
        return hash(password, mergedConfig.argon2Config);
    }

    async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
        return verify(hashedPassword, password, mergedConfig.argon2Config);
    }

    function validateUsername(username: unknown): username is string {
        return (
            typeof username === 'string' &&
            username.length >= 3 &&
            username.length <= 31 &&
            /^[a-z0-9_-]+$/.test(username)
        );
    }

    function validatePassword(password: unknown): password is string {
        return typeof password === 'string' && password.length >= 6 && password.length <= 255;
    }

    return {
        config: mergedConfig,
        generateSessionToken,
        generateUserId,
        createSession,
        validateSessionToken,
        invalidateSession,
        hashPassword,
        verifyPassword,
        validateUsername,
        validatePassword
    };
}

export type AuthUtils = ReturnType<typeof createAuth>;