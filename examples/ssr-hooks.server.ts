// hooks.server.ts (SSR version)
import { handleAuth } from './lib/auth-setup';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = handleAuth;