// src/hooks.server.ts
import { handleAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = handleAuth;