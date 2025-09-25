// src/routes/api/auth/login/+server.ts (SPA version)
import { apiHandlers } from '$lib/auth-setup';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = apiHandlers.login;