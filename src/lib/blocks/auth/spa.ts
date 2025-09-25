// SPA-specific exports (API handlers, client store)
export { createApiHandlers } from './spa/server.js';
export { createAuthStore } from './spa/client.svelte.js';
export type { AuthStore } from './spa/client.svelte.js';