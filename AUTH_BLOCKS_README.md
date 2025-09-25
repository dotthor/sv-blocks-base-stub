# SvelteKit Auth Blocks

A modular, reusable authentication system for SvelteKit applications that supports both traditional SSR (Server-Side Rendering) and SPA (Single Page Application) patterns.

## Features

- 🔒 **Session-based authentication** with secure HTTP-only cookies
- 🔑 **Argon2 password hashing** with configurable parameters
- 🎯 **Conditional imports** - only load what you need for your app type
- 🔄 **Easy migration** between SSR and SPA patterns
- ⚙️ **Highly configurable** with sensible defaults
- 📦 **Type-safe** throughout with TypeScript
- 🚀 **Drop-in ready** for new SvelteKit projects

## Installation

1. Copy the `src/lib/blocks/auth/` directory to your SvelteKit project
2. Install required dependencies:

```bash
pnpm add @node-rs/argon2 @oslojs/crypto @oslojs/encoding drizzle-orm
```

3. Set up your database schema (example with Drizzle):

```typescript
// src/lib/server/db/schema.ts
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
```

## Usage

### Option 1: SSR (Traditional SvelteKit with Form Actions)

#### 1. Set up auth utilities

```typescript
// src/lib/auth-setup.ts
import { createAuth } from '$lib/blocks/auth';
import { createFormActions, createHandleAuth } from '$lib/blocks/auth/ssr';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Create the core auth utilities
export const auth = createAuth(db, table.user, table.session, {
  sessionCookieName: 'my-app-session',
  sessionDurationDays: 30,
  renewalThresholdDays: 15
});

// Create SSR-specific utilities
export const formActions = createFormActions(auth, db, table.user);
export const handleAuth = createHandleAuth(auth);
```

#### 2. Set up server hooks

```typescript
// src/hooks.server.ts
import { handleAuth } from '$lib/auth-setup';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = handleAuth;
```

#### 3. Add form actions to your login page

```typescript
// src/routes/login/+page.server.ts
import { formActions } from '$lib/auth-setup';
import type { Actions } from './$types';

export const actions: Actions = {
  login: formActions.login,
  register: formActions.register
};
```

#### 4. Create login form

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
  import { enhance } from '$app/forms';
  
  /** @type {import('./$types').ActionData} */
  let { form } = $props();
</script>

<form method="POST" action="?/login" use:enhance>
  {#if form?.message}
    <p class="error">{form.message}</p>
  {/if}
  
  <label>
    Username
    <input name="username" type="text" required />
  </label>
  
  <label>
    Password
    <input name="password" type="password" required />
  </label>
  
  <button type="submit">Login</button>
  <button type="submit" formaction="?/register">Register</button>
</form>
```

#### 5. Add logout action (optional)

```typescript
// src/routes/+layout.server.ts
import { formActions } from '$lib/auth-setup';
import type { Actions } from './$types';

export const actions: Actions = {
  logout: formActions.logout
};
```

### Option 2: SPA (Single Page Application with API endpoints)

#### 1. Set up auth utilities

```typescript
// src/lib/auth-setup.ts
import { createAuth } from '$lib/blocks/auth';
import { createApiHandlers } from '$lib/blocks/auth/spa';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// Create the core auth utilities
export const auth = createAuth(db, table.user, table.session);

// Create SPA-specific utilities (server-side)
export const apiHandlers = createApiHandlers(auth, db, table.user);
```

#### 2. Create API endpoints

```typescript
// src/routes/api/auth/login/+server.ts
import { apiHandlers } from '$lib/auth-setup';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = apiHandlers.login;
```

```typescript
// src/routes/api/auth/register/+server.ts
import { apiHandlers } from '$lib/auth-setup';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = apiHandlers.register;
```

```typescript
// src/routes/api/auth/logout/+server.ts
import { apiHandlers } from '$lib/auth-setup';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = apiHandlers.logout;
```

```typescript
// src/routes/api/auth/me/+server.ts
import { apiHandlers } from '$lib/auth-setup';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = apiHandlers.me;
```

#### 3. Set up client-side auth store

```typescript
// src/lib/stores/auth.svelte.ts
import { createAuthStore } from '$lib/blocks/auth/spa';

export const authStore = createAuthStore();

// Auto-check auth on app start
if (typeof window !== 'undefined') {
  authStore.checkAuth();
}
```

#### 4. Create login component

```svelte
<!-- src/routes/login/+page.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  
  let username = $state('');
  let password = $state('');
  
  async function handleLogin() {
    const result = await authStore.login(username, password);
    if (result.success) {
      goto('/dashboard');
    }
  }
  
  async function handleRegister() {
    const result = await authStore.register(username, password);
    if (result.success) {
      goto('/dashboard');
    }
  }
</script>

<form onsubmit|preventDefault={handleLogin}>
  {#if authStore.error}
    <p class="error">{authStore.error}</p>
  {/if}
  
  <label>
    Username
    <input bind:value={username} type="text" required />
  </label>
  
  <label>
    Password
    <input bind:value={password} type="password" required />
  </label>
  
  <button type="submit" disabled={authStore.loading}>
    {authStore.loading ? 'Loading...' : 'Login'}
  </button>
  
  <button type="button" onclick={handleRegister} disabled={authStore.loading}>
    Register
  </button>
</form>
```

#### 5. Use auth state in components

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
</script>

<nav>
  {#if authStore.isAuthenticated}
    <p>Welcome, {authStore.user?.username}!</p>
    <button onclick={() => authStore.logout()}>Logout</button>
  {:else}
    <a href="/login">Login</a>
  {/if}
</nav>
```

## Configuration Options

You can customize the auth behavior by passing a config object:

```typescript
const auth = createAuth(db, userTable, sessionTable, {
  // Cookie name for sessions
  sessionCookieName: 'my-custom-session',
  
  // How long sessions last (in days)
  sessionDurationDays: 7,
  
  // When to renew sessions (in days before expiry)
  renewalThresholdDays: 2,
  
  // Redirect URLs for different auth actions
  redirects: {
    afterLogin: '/dashboard',     // Where to go after successful login
    afterRegister: '/onboarding', // Where to go after successful registration
    afterLogout: '/login'         // Where to go after logout
  },
  
  // Argon2 password hashing parameters
  argon2Config: {
    memoryCost: 19456,  // Memory usage in KB
    timeCost: 2,        // Number of iterations
    outputLen: 32,      // Hash length in bytes
    parallelism: 1      // Number of threads
  }
});
```

## Type Definitions

The auth system provides these TypeScript types:

```typescript
interface User {
  id: string;
  username: string;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

interface SessionValidationResult {
  session: Session | null;
  user: User | null;
}

interface AuthConfig {
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
```

## App.d.ts Setup

For SSR apps, add these types to your `src/app.d.ts`:

```typescript
// src/app.d.ts
import type { User, Session } from '$lib/blocks/auth';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}

export {};
```

## Protected Routes

Route protection works differently for SSR and SPA apps. Here's how authentication flows work:

### How Authentication Works

#### SSR Flow:
1. **Server hook** (`hooks.server.ts`) runs on **every single request**
2. **Extracts session cookie** from the request headers
3. **Validates session** against your database (checks if valid/expired)
4. **Sets `event.locals.user`** with user data (or `null` if not authenticated)
5. **Page load functions** can immediately access `locals.user` to check authentication
6. **Server-side redirects** happen before any HTML is sent to the browser

**Key Point**: The hook runs BEFORE your page loads, so `locals.user` is always available and up-to-date.

#### SPA Flow:
1. **Client-side auth store** manages authentication state in memory
2. **Initial auth check** happens on app load via `/api/auth/me` endpoint
3. **Route guards** check auth state and redirect if needed (client-side)
4. **API calls** include session cookies automatically (HTTP-only cookies)
5. **Reactive updates** when auth state changes

**Key Point**: Authentication state is managed client-side, so you need guards on each protected route.

#### The Role of `hooks.server.ts` (SSR Only)

The server hook is the **foundation** of SSR authentication. Here's what it does:

```typescript
// src/hooks.server.ts
import { handleAuth } from '$lib/auth-setup';

export const handle = handleAuth;
```

**What happens on every request:**

1. **Request comes in** → `https://yourapp.com/dashboard`
2. **Hook extracts cookie** → Gets `auth-session=abc123` from headers
3. **Validates session** → Checks if `abc123` exists in database and isn't expired
4. **Sets locals** → `event.locals.user = { id: "user1", username: "john" }`
5. **Route runs** → Your `+page.server.ts` can access `locals.user`

**This means:**
- ✅ Every route automatically knows if user is authenticated
- ✅ No need to check authentication manually in every load function
- ✅ User data is fresh on every request (can't be tampered with)
- ✅ Works even if JavaScript is disabled

**Without the hook**, you'd have to manually check authentication in every single `+page.server.ts` file!

### SSR Protected Routes

The server hook automatically makes user data available in `locals`, so you can protect routes in load functions:

#### Basic Protection
```typescript
// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // User data is automatically available from the hook
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  return {
    user: locals.user
  };
};
```

#### Layout-Level Protection
Protect entire sections of your app:

```typescript
// src/routes/(protected)/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    // Redirect to login with return URL
    const redirectTo = encodeURIComponent(url.pathname + url.search);
    throw redirect(302, `/login?redirectTo=${redirectTo}`);
  }
  
  return {
    user: locals.user
  };
};
```

#### Role-Based Protection
```typescript
// src/routes/(admin)/+layout.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Check if user has admin role (extend User interface as needed)
  if (!locals.user.isAdmin) {
    throw error(403, 'Access denied');
  }
  
  return {
    user: locals.user
  };
};
```

#### Common Route Organization Patterns

Here are the most popular ways to organize auth-protected routes:

**Pattern 1: Public Root + App Directory (Very Common)**
```
src/routes/
├── +page.svelte              # Landing/login page (public)
├── +layout.svelte            # Public layout
├── about/                    # Other public pages
├── pricing/
└── app/                      # Main authenticated app
    ├── +layout.server.ts     # Protects all /app/* routes
    ├── +layout.svelte        # App shell (nav, sidebar, etc.)
    ├── +page.svelte          # /app (dashboard/home)
    ├── dashboard/            # /app/dashboard
    ├── profile/              # /app/profile
    ├── settings/             # /app/settings
    └── projects/
        ├── +page.svelte      # /app/projects
        └── [id]/
            └── +page.svelte  # /app/projects/123
```

**Pattern 2: Route Groups with Parentheses (SvelteKit Recommended)**
```
src/routes/
├── (public)/                 # Public routes (URL: /)
│   ├── +layout.svelte        # Public layout
│   ├── +page.svelte          # Home/landing page
│   ├── login/                # /login
│   ├── register/             # /register
│   ├── about/                # /about
│   └── pricing/              # /pricing
├── (app)/                    # Protected routes (URL: /)
│   ├── +layout.server.ts     # Auth protection
│   ├── +layout.svelte        # App layout
│   ├── dashboard/            # /dashboard
│   ├── profile/              # /profile
│   └── settings/             # /settings
└── (admin)/                  # Admin-only routes
    ├── +layout.server.ts     # Admin check
    └── admin/                # /admin
```

**Pattern 3: Mixed Public/Protected (Simple Projects)**
```
src/routes/
├── +layout.svelte            # Root layout
├── +page.svelte              # Public home
├── login/                    # /login
├── dashboard/                # /dashboard (protected individually)
│   └── +page.server.ts       # Auth check here
├── profile/                  # /profile (protected individually)
│   └── +page.server.ts       # Auth check here
└── settings/                 # /settings (protected individually)
    └── +page.server.ts       # Auth check here
```

**Pattern 4: Domain-Based Organization**
```
src/routes/
├── +page.svelte              # Marketing home
├── auth/
│   ├── login/                # /auth/login
│   └── register/             # /auth/register
├── dashboard/                # /dashboard (main app)
│   ├── +layout.server.ts     # Protection
│   └── +page.svelte
├── projects/                 # /projects (feature area)
│   ├── +layout.server.ts     # Protection
│   ├── +page.svelte
│   └── [id]/
└── admin/                    # /admin (admin area)
    ├── +layout.server.ts     # Admin protection
    └── +page.svelte
```

#### Which Pattern Should You Choose?

**Pattern 1 (`/app/*`) - Recommended for Most Apps:**
- ✅ **Clear separation** between marketing site and app
- ✅ **Single protection point** - one `+layout.server.ts` protects everything
- ✅ **Easy navigation** - all app routes start with `/app`
- ✅ **SEO friendly** - public pages at root level
- ✅ **Scalable** - easy to add new app features
- 🎯 **Best for**: SaaS apps, dashboards, most web applications

**Pattern 2 (Route Groups) - SvelteKit's Preferred Method:**
- ✅ **Clean URLs** - no `/app` prefix needed
- ✅ **Flexible layouts** - different layouts for different sections
- ✅ **Advanced routing** - complex apps with multiple user types
- ⚠️ **More complex** - requires understanding route groups
- 🎯 **Best for**: Complex apps, multi-tenant systems, advanced use cases

**Pattern 3 (Individual Protection) - Simple but Repetitive:**
- ✅ **Simple to understand** - each route handles its own auth
- ✅ **Granular control** - different auth logic per route
- ❌ **Repetitive code** - auth check in every file
- ❌ **Easy to forget** - might miss protecting a route
- 🎯 **Best for**: Small apps, prototypes, learning

**Pattern 4 (Domain-Based) - Enterprise Approach:**
- ✅ **Feature-based organization** - routes grouped by domain
- ✅ **Team scalability** - different teams can own different areas
- ✅ **Microservice ready** - easy to split later
- ⚠️ **More files** - more `+layout.server.ts` files to maintain
- 🎯 **Best for**: Large apps, enterprise, team development

#### Real-World Examples

**Your Pattern (`/` + `/app/*`) in Practice:**

```typescript
// src/routes/+page.svelte (Public landing/login)
<script>
  import { authStore } from '$lib/stores/auth.svelte'; // for SPA
  // or check page data for SSR
  
  // Redirect if already logged in
  if (authStore.isAuthenticated) {
    goto('/app');
  }
</script>

<h1>Welcome to MyApp</h1>
<LoginForm />
```

```typescript
// src/routes/app/+layout.server.ts (Protects ALL /app/* routes)
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(302, `/?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  
  return { user: locals.user };
};
```

```svelte
<!-- src/routes/app/+layout.svelte (App shell) -->
<script>
  let { data, children } = $props();
</script>

<div class="app-shell">
  <nav>
    <a href="/app">Dashboard</a>
    <a href="/app/projects">Projects</a>
    <a href="/app/settings">Settings</a>
    <form method="POST" action="/logout">
      <button>Logout</button>
    </form>
  </nav>
  
  <main>
    {@render children()}
  </main>
</div>
```

This pattern is **very common** and used by popular apps like:
- **GitHub** (`/` for marketing, main app functionality)
- **Linear** (`/` for landing, `/team/*` for app)
- **Notion** (`/` for marketing, `/workspace/*` for app)
- **Vercel** (`/` for landing, `/dashboard/*` for app)

### SPA Protected Routes

For SPAs, protection happens client-side with reactive auth state:

#### Basic Route Guard
```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    if (!authStore.isAuthenticated) {
      goto('/login?redirectTo=/dashboard');
    }
  });
</script>

{#if authStore.isAuthenticated}
  <h1>Dashboard</h1>
  <p>Welcome, {authStore.user?.username}!</p>
{:else}
  <p>Redirecting to login...</p>
{/if}
```

#### Reusable Route Guard Component
```svelte
<!-- src/lib/components/RouteGuard.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let { redirectTo = '/login', requireAuth = true } = $props();
  
  onMount(() => {
    if (requireAuth && !authStore.isAuthenticated) {
      const currentPath = encodeURIComponent($page.url.pathname + $page.url.search);
      goto(`${redirectTo}?redirectTo=${currentPath}`);
    }
  });
</script>

{#if authStore.loading}
  <div class="loading">Checking authentication...</div>
{:else if requireAuth && !authStore.isAuthenticated}
  <div class="redirecting">Redirecting to login...</div>
{:else}
  <slot />
{/if}
```

#### Using Route Guard
```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script>
  import RouteGuard from '$lib/components/RouteGuard.svelte';
</script>

<RouteGuard>
  <h1>Dashboard</h1>
  <p>This content is protected!</p>
</RouteGuard>
```

#### Layout-Level SPA Protection
```svelte
<!-- src/routes/(protected)/+layout.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  onMount(() => {
    if (!authStore.isAuthenticated && !authStore.loading) {
      const redirectTo = encodeURIComponent($page.url.pathname + $page.url.search);
      goto(`/login?redirectTo=${redirectTo}`);
    }
  });
</script>

{#if authStore.loading}
  <div class="loading-screen">
    <p>Loading...</p>
  </div>
{:else if authStore.isAuthenticated}
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/profile">Profile</a>
    <button onclick={() => authStore.logout()}>Logout</button>
  </nav>
  
  <main>
    <slot />
  </main>
{:else}
  <p>Redirecting to login...</p>
{/if}
```

### Advanced Protection Patterns

#### Redirect After Login
Handle the `redirectTo` parameter in your login forms:

```svelte
<!-- src/routes/login/+page.svelte (SSR version) -->
<script>
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  
  let { form } = $props();
  
  // Get redirect URL from query params
  const redirectTo = $page.url.searchParams.get('redirectTo') || '/dashboard';
</script>

<form method="POST" action="?/login" use:enhance>
  <!-- Hidden field to preserve redirect URL -->
  <input type="hidden" name="redirectTo" value={redirectTo} />
  
  <!-- Rest of form -->
</form>
```

Update your form action to handle redirects:

```typescript
// In your SSR form actions
async login(event: RequestEvent) {
  const formData = await event.request.formData();
  const redirectTo = formData.get('redirectTo')?.toString() || auth.config.redirects.afterLogin;
  
  // ... authentication logic ...
  
  return redirect(302, redirectTo);
}
```

#### Conditional Navigation
```svelte
<!-- Show different content based on auth state -->
<script>
  import { authStore } from '$lib/stores/auth.svelte'; // SPA
  // or get user from page data for SSR
</script>

<nav>
  {#if authStore.isAuthenticated} <!-- SPA -->
  <!-- or {#if data.user} for SSR -->
    <a href="/dashboard">Dashboard</a>
    <a href="/profile">Profile</a>
    <button onclick={() => authStore.logout()}>Logout</button>
  {:else}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}
</nav>
```

### Security Considerations

#### SSR Security (Recommended)
- ✅ **Server-side validation** - Auth checked before page renders
- ✅ **No client-side bypass** - JavaScript disabled won't break protection
- ✅ **SEO friendly** - Protected pages return proper HTTP status codes
- ✅ **Faster initial load** - No auth check delay

#### SPA Security Notes
- ⚠️ **Client-side only** - Relies on JavaScript being enabled
- ⚠️ **Brief content flash** - May show protected content before redirect
- ⚠️ **API protection needed** - Always validate auth on API endpoints
- ✅ **Better UX** - Smoother navigation after initial load

#### Hybrid Approach
You can combine both for maximum security:

```typescript
// src/routes/(protected)/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  // Server-side check (primary security)
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  return { user: locals.user };
};
```

```svelte
<!-- src/routes/(protected)/+page.svelte -->
<script>
  import { authStore } from '$lib/stores/auth.svelte';
  
  let { data } = $props(); // Contains user from server
  
  // Sync server data with client store
  $effect(() => {
    if (data.user && !authStore.user) {
      authStore.setUser(data.user);
    }
  });
</script>

<!-- Content is guaranteed to have authenticated user -->
<h1>Welcome, {data.user.username}!</h1>
```

## Migration Between Patterns

To migrate from SSR to SPA (or vice versa):

1. **Change imports**: Replace `/ssr` imports with `/spa` imports
2. **Replace handlers**: Convert form actions to API endpoints (or vice versa)
3. **Update client code**: Add reactive stores for SPA or forms for SSR
4. **Update routing**: Client-side routing for SPA or server redirects for SSR

The core auth utilities (`createAuth`) remain the same, so your user data and sessions are preserved.

## Security Considerations

- ✅ **HTTP-only cookies** prevent XSS attacks
- ✅ **Secure cookies** in production (HTTPS)
- ✅ **SameSite=lax** prevents CSRF
- ✅ **Argon2** password hashing with salt
- ✅ **Session expiration** and renewal
- ✅ **Input validation** for usernames and passwords

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure you've copied the auth blocks to `src/lib/blocks/auth/`

2. **Database errors**: Ensure your database schema matches the expected structure

3. **Cookie issues**: Check that your app is served over HTTPS in production

4. **Type errors**: Make sure you've set up `src/app.d.ts` correctly for SSR apps

5. **SSR routes not protected**: 
   - ❌ Forgot to set up `hooks.server.ts`
   - ❌ Hook not running (check server logs)
   - ❌ `locals.user` is `undefined` in load functions

6. **SPA routes showing briefly before redirect**:
   - This is normal behavior - add loading states
   - Use `{#if authStore.loading}` to show loading spinner

7. **"locals.user is null" but user is logged in**:
   - Check that session cookie is being sent
   - Verify database connection in hook
   - Check session hasn't expired

8. **Infinite redirect loops**:
   - Don't protect the login page itself
   - Check redirect URLs in configuration

### Debug Mode

You can add logging to debug auth issues:

```typescript
const auth = createAuth(db, userTable, sessionTable, {
  // Add custom logging
  onSessionCreated: (session) => console.log('Session created:', session.id),
  onSessionValidated: (result) => console.log('Session validated:', result.user?.username)
});
```

## Examples

Check the `/examples` directory for complete working examples of both SSR and SPA implementations.

## Contributing

Feel free to extend these auth blocks with additional features like:
- OAuth providers
- Two-factor authentication
- Password reset functionality
- User roles and permissions
- Rate limiting

The modular structure makes it easy to add new features while maintaining backward compatibility.