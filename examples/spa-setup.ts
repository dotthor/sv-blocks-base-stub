// src/lib/auth-setup.ts (SPA version)
import { createAuth } from '$lib/blocks/auth';
import { createApiHandlers } from '$lib/blocks/auth/spa';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Create the core auth utilities
export const auth = createAuth(db, table.user, table.session);

// Create SPA-specific utilities (server-side)
export const apiHandlers = createApiHandlers(auth, db, table.user);