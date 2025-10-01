// Example: The popular "/" + "/app/*" pattern
// This is the pattern you mentioned and it's very common!

// File structure:
// src/routes/
// ├── +page.svelte              # Landing page with login (/)
// ├── +layout.svelte            # Public layout
// └── app/                      # Protected app area
//     ├── +layout.server.ts     # Protects ALL /app/* routes
//     ├── +layout.svelte        # App shell with navigation
//     ├── +page.svelte          # /app (main dashboard)
//     ├── dashboard/            # /app/dashboard
//     ├── projects/             # /app/projects
//     │   ├── +page.svelte      # Project list
//     │   └── [id]/             # /app/projects/123
//     │       └── +page.svelte  # Individual project
//     ├── profile/              # /app/profile
//     └── settings/             # /app/settings

// Benefits of this pattern:
// 1. Clear separation: marketing site vs app
// 2. Single auth check protects entire app
// 3. Clean URLs for app features
// 4. Easy to add new app sections
// 5. Used by many popular SaaS apps

// Example files:

// src/routes/+page.svelte (Landing/Login page)
/*
<script>
  import LoginForm from '$lib/components/LoginForm.svelte';
  import { authStore } from '$lib/stores/auth.svelte'; // SPA
  import { goto } from '$app/navigation';

  // If already logged in, go to app
  $effect(() => {
    if (authStore.isAuthenticated) {
      goto('/app');
    }
  });
</script>

<div class="landing">
  <h1>Welcome to MyApp</h1>
  <p>The best app for managing your projects</p>

  {#if !authStore.isAuthenticated}
    <LoginForm />
  {/if}
</div>
*/

// src/routes/app/+layout.server.ts (Protects entire app)
/*
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    // Redirect to landing page with return URL
    const returnTo = encodeURIComponent(url.pathname + url.search);
    throw redirect(302, `/?redirectTo=${returnTo}`);
  }

  return {
    user: locals.user
  };
};
*/

// src/routes/app/+layout.svelte (App shell)
/*
<script>
  let { data, children } = $props();
</script>

<div class="app">
  <nav class="sidebar">
    <div class="user-info">
      <img src="/avatar.jpg" alt="Avatar" />
      <span>{data.user.username}</span>
    </div>
    
    <ul class="nav-links">
      <li><a href="/app" class="nav-link">Dashboard</a></li>
      <li><a href="/app/projects" class="nav-link">Projects</a></li>
      <li><a href="/app/profile" class="nav-link">Profile</a></li>
      <li><a href="/app/settings" class="nav-link">Settings</a></li>
    </ul>
    
    <form method="POST" action="/logout" class="logout-form">
      <button type="submit" class="logout-btn">Logout</button>
    </form>
  </nav>
  
  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
  }
  
  .sidebar {
    background: #f8f9fa;
    padding: 1rem;
    border-right: 1px solid #e9ecef;
  }
  
  .content {
    padding: 2rem;
    overflow-y: auto;
  }
</style>
*/