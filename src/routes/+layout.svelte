<script>
  export let data;
  import "../app.css";
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import {
    Menu,
    X,
    Facebook,
    Twitter,
    Github,
    LayoutDashboard,
    Info,
    Mail,
    User,
    Settings,
    LogOut,
    LogIn,
    UserPlus,
    Network,
    Shield,
    Users,
    Crown,
    Award,
    Gift,
    Tags,
    FolderPlus,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { Toaster, toast } from "svelte-sonner";
  import { goto, invalidateAll } from "$app/navigation";
  import { isAdmin, isTeamLeader, isMember, getRoleName } from "$lib/auth/roles.js";

  $: if (browser && $page.url.pathname) {
    const drawerToggle = document.getElementById("drawer-toggle");
    if (drawerToggle && "checked" in drawerToggle) {
      drawerToggle.checked = false;
    }
  }
  
  let { supabase, session } = data;

  $: userRole = data.profile ? getRoleName(data.profile) : null;
  $: userIsAdmin = data.profile ? isAdmin(data.profile) : false;
  $: userIsTeamLeader = data.profile ? isTeamLeader(data.profile) : false;
  $: userIsMember = data.profile ? isMember(data.profile) : false;

  supabase.auth.onAuthStateChange((event, newSession) => {
    if (event === "SIGNED_IN") {
      session = newSession;
      invalidateAll();

      console.log("User signed in:", JSON.stringify(session.user));
    }

    if (event === "SIGNED_OUT") {
      session = null;
      goto("/");
      invalidateAll();
    }
  });
</script>

<div class="drawer">
  <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- HEADER -->
    {#if !$page.url.pathname.startsWith("/auth") && $page.url.pathname !== "/"}
      <header class="bg-white border-b border-svelte-100 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-4">
              <!-- MOBILE MENU -->
              <label
                for="drawer-toggle"
                class="lg:hidden p-2 -ml-2 rounded-lg text-gray-700 hover:bg-svelte-50 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu class="w-5 h-5" />
              </label>
              <!-- BRAND -->
              <button
                onclick={() => goto("/dashboard")}
                class="flex items-center gap-2 text-xl font-semibold text-svelte-primary hover:text-svelte-700 transition-colors"
              >
                <img src="/svelte.png" alt="App Logo" class="w-6 h-6" />
                {PUBLIC_APP_NAME}
              </button>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-8">
              {#if session && userRole}
                {#if userIsTeamLeader || userIsMember}
                  <a
                    href="/dashboard"
                    class="text-gray-600 hover:text-svelte-primary font-medium transition-colors {$page
                      .url.pathname === '/dashboard'
                      ? 'text-svelte-primary border-b-2 border-svelte-primary pb-1'
                      : 'pb-1'}"
                  >
                    Dashboard
                  </a>

                  <a
                    href="/users/teams"
                    class="text-gray-600 hover:text-svelte-primary font-medium transition-colors {$page
                      .url.pathname === '/users/teams'
                      ? 'text-svelte-primary border-b-2 border-svelte-primary pb-1'
                      : 'pb-1'}"
                  >
                    Teams
                  </a>
                {/if}
              {/if}

              <!-- Role-based navigation -->
              {#if session && userRole}
                {#if userIsAdmin}
                  <div class="relative dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="text-gray-600 hover:text-svelte-primary font-medium transition-colors {$page
                      .url.pathname.startsWith('/users/ad')
                      ? 'text-svelte-primary border-b-2 border-svelte-primary pb-1'
                      : 'pb-1'} cursor-pointer">
                      Admin
                    </div>
                    <ul class="dropdown-content menu bg-white rounded-lg shadow-lg border border-gray-200 w-48 p-2 mt-1 z-50">
                      <li>
                        <a href="/users/ad" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/users/ad/achievements" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Achievements
                        </a>
                      </li>
                      <li>
                        <a href="/users/ad/rewards" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Rewards
                        </a>
                      </li>
                      <li>
                        <a href="/users/ad/task-categories" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Task Categories
                        </a>
                      </li>
                    </ul>
                  </div>
                {/if}
                
                {#if userIsTeamLeader || userIsAdmin}
                  <div class="relative dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="text-gray-600 hover:text-svelte-primary font-medium transition-colors {$page
                      .url.pathname.startsWith('/users/tl')
                      ? 'text-svelte-primary border-b-2 border-svelte-primary pb-1'
                      : 'pb-1'} cursor-pointer">
                      Team Leader
                    </div>
                    <ul class="dropdown-content menu bg-white rounded-lg shadow-lg border border-gray-200 w-48 p-2 mt-1 z-50">
                      <li>
                        <a href="/users/tl" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/users/tl/create-projects" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Create Projects
                        </a>
                      </li>
                      <li>
                        <a href="/users/tl/manage-members" class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm">
                          Manage Members
                        </a>
                      </li>
                    </ul>
                  </div>
                {/if}
                
              {/if}
            </nav>

            <!-- Auth/User Menu -->
            <div class="relative">
              {#if session}
                <!-- Authenticated User Menu -->
                <div class="dropdown dropdown-end">
                  <div
                    tabindex="0"
                    role="button"
                    class="p-1 rounded-full hover:bg-svelte-50 transition-colors"
                    aria-label="Open user menu"
                  >
                    <img
                      class="w-8 h-8 rounded-full object-cover"
                      alt="User avatar"
                      src={session.user?.user_metadata?.profile_picture || `https://ui-avatars.com/api/?name=${data.profile.first_name}&background=random&bold=true`} 
                    />
                  </div>
                  <!-- USER MENU -->
                  <ul
                    class="dropdown-content menu bg-white rounded-lg shadow-lg border border-svelte-100 w-48 p-2 mt-2"
                  >
                    <!-- User Role Indicator -->
                    {#if userRole}
                      <li class="menu-title">
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {userRole}
                        </span>
                      </li>
                      <li><hr class="my-1 border-svelte-100" /></li>
                    {/if}
                    
                    <li>
                      <a
                        href="/users/account/profile"
                        class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm font-medium transition-colors {$page
                          .url.pathname === '/account/profile'
                          ? 'bg-svelte-100 text-svelte-primary'
                          : ''}">Profile</a
                      >
                    </li>
                    <li>
                      <a
                        href="/users/account/settings"
                        class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm font-medium transition-colors {$page
                          .url.pathname === '/account/settings'
                          ? 'bg-svelte-100 text-svelte-primary'
                          : ''}">Settings</a
                      >
                    </li>
                    <li><hr class="my-1 border-svelte-100" /></li>
                    <li>
                      <button
                        type="button"
                        class="text-gray-700 hover:bg-svelte-50 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full text-left"
                        aria-label="Logout"
                        onclick={() => supabase.auth.signOut()}>Sign out</button
                      >
                    </li>
                  </ul>
                </div>
              {:else}
                <!-- Unauthenticated User Links -->
                <div class="flex items-center gap-3">
                  <a
                    href="/"
                    class="text-gray-600 hover:text-svelte-primary font-medium transition-colors"
                    >Login</a
                  >
                  <a
                    href="/auth/register"
                    class="bg-svelte-primary hover:bg-svelte-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >Sign Up</a
                  >
                </div>
              {/if}
            </div>
          </div>
        </div>
      </header>
    {/if}

    <!-- CONTENTS -->
    <main class="min-h-screen bg-svelte-50">
      <slot></slot>
    </main>

    <!-- FOOTER -->
    {#if !$page.url.pathname.startsWith("/auth") && $page.url.pathname !== "/"}
      <footer class="bg-white border-t border-svelte-200">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <!-- Main footer content -->
          <div
            class="flex flex-col md:flex-row md:justify-between md:items-center gap-6"
          >
            <!-- Brand and copyright -->
            <div class="text-center md:text-left">
              <div
                class="flex items-center gap-2 justify-center md:justify-start mb-2"
              >
                <img src="/svelte.png" alt="App Logo" class="w-5 h-5" />
                <h3 class="font-bold text-lg text-svelte-primary">
                  {PUBLIC_APP_NAME}
                </h3>
              </div>
              <p class="text-sm text-gray-600">
                © {new Date().getFullYear()}
                {PUBLIC_APP_NAME}. All rights reserved.
              </p>
            </div>

            <!-- Navigation links -->
            <nav
              class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2"
            >
              <!-- <a
                href="/about"
                class="text-sm text-gray-600 hover:bg-svelte-primary hover:text-white px-2 py-1 rounded transition-colors {$page
                  .url.pathname === '/about'
                  ? 'bg-svelte-primary text-white'
                  : ''}">About</a
              >
              <a
                href="/contact"
                class="text-sm text-gray-600 hover:bg-svelte-primary hover:text-white px-2 py-1 rounded transition-colors {$page
                  .url.pathname === '/contact'
                  ? 'bg-svelte-primary text-white'
                  : ''}">Contact</a
              > -->
            </nav>
          </div>

          <!-- Divider -->
          <div class="divider my-6"></div>

          <!-- Social media icons -->
          <div class="flex justify-center gap-4">
            <a
              href="https://facebook.com"
              class="btn btn-ghost btn-sm btn-circle text-gray-600 hover:text-svelte-primary hover:opacity-70"
              aria-label="Visit our Facebook page"
            >
              <Facebook class="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              class="btn btn-ghost btn-sm btn-circle text-gray-600 hover:text-svelte-primary hover:opacity-70"
              aria-label="Visit our Twitter page"
            >
              <Twitter class="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              class="btn btn-ghost btn-sm btn-circle text-gray-600 hover:text-svelte-primary hover:opacity-70"
              aria-label="Visit our GitHub repository"
            >
              <Github class="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    {/if}
  </div>

  <!-- DRAWER SIDE -->
  {#if !$page.url.pathname.startsWith("/auth") && $page.url.pathname !== "/"}
    <div class="drawer-side">
      <label
        for="drawer-toggle"
        aria-label="Close drawer"
        class="drawer-overlay"
      ></label>
      <aside
        class="min-h-full w-80 bg-white border-r border-svelte-200 flex flex-col"
      >
        <!-- Drawer header -->
        <div
          class="flex items-center justify-between p-6 border-b border-svelte-100"
        >
          <div class="flex items-center gap-2">
            <img src="/svelte.png" alt="App Logo" class="w-5 h-5" />
            <h2 class="text-lg font-semibold text-svelte-primary">
              {PUBLIC_APP_NAME}
            </h2>
          </div>
          <label
            for="drawer-toggle"
            class="p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-svelte-50 transition-colors"
            aria-label="Close menu"
          >
            <X class="w-5 h-5" />
          </label>
        </div>

        <!-- Navigation menu -->
        <div class="flex-1 py-6">
          <nav class="space-y-1 px-6">
            <a
              href="/dashboard"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                .url.pathname === '/dashboard'
                ? 'bg-svelte-primary text-white'
                : 'text-gray-700 hover:bg-svelte-50'}"
            >
              <LayoutDashboard class="w-5 h-5" />
              Dashboard
            </a>
            <a
              href="/users/teams"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                .url.pathname === '/users/teams'
                ? 'bg-svelte-primary text-white'
                : 'text-gray-700 hover:bg-svelte-50'}"
            >
              <Network class="w-5 h-5" />
              Teams
            </a>

            <!-- Role-based navigation -->
            {#if session && userRole}
              {#if userIsAdmin}
                <div class="space-y-1">
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Admin
                  </div>
                  <a
                    href="/users/ad"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname === '/users/ad'
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Shield class="w-5 h-5" />
                    Dashboard
                  </a>
                  <a
                    href="/users/ad/achievements"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/ad/achievements')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Award class="w-5 h-5" />
                    Achievements
                  </a>
                  <a
                    href="/users/ad/rewards"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/ad/rewards')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Gift class="w-5 h-5" />
                    Rewards
                  </a>
                  <a
                    href="/users/ad/task-categories"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/ad/task-categories')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Tags class="w-5 h-5" />
                    Task Categories
                  </a>
                </div>
              {/if}
              
              {#if userIsTeamLeader || userIsAdmin}
                <div class="space-y-1">
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Team Leader
                  </div>
                  <a
                    href="/users/tl"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname === '/users/tl'
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Crown class="w-5 h-5" />
                    Dashboard
                  </a>
                  <a
                    href="/users/tl/create-projects"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/tl/create-projects')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <FolderPlus class="w-5 h-5" />
                    Create Projects
                  </a>
                  <a
                    href="/users/tl/manage-members"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/tl/manage-members')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Users class="w-5 h-5" />
                    Manage Members
                  </a>
                  <a
                    href="/users/tl/update-projects"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/tl/update-projects')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <Settings class="w-5 h-5" />
                    Update Projects
                  </a>
                </div>
              {/if}
              
              {#if userIsMember || userIsTeamLeader || userIsAdmin}
                <div class="space-y-1">
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    My Area
                  </div>
                  <a
                    href="/users/me"
                    class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                      .url.pathname.startsWith('/users/me')
                      ? 'bg-svelte-primary text-white'
                      : 'text-gray-700 hover:bg-svelte-50'}"
                  >
                    <User class="w-5 h-5" />
                    My Area
                  </a>
                </div>
              {/if}
            {/if}
          </nav>

          {#if session}
            <!-- Divider -->
            <div class="border-t border-svelte-100 my-6 mx-6"></div>

            <!-- User navigation -->
            <nav class="space-y-1 px-6">
              <!-- <a
                href="/account/profile"
                class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                  .url.pathname === '/account/profile'
                  ? 'bg-svelte-primary text-white'
                  : 'text-gray-700 hover:bg-svelte-50'}"
              >
                <User class="w-5 h-5" />
                Profile
              </a>
              <a
                href="/account/settings"
                class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                  .url.pathname === '/account/settings'
                  ? 'bg-svelte-primary text-white'
                  : 'text-gray-700 hover:bg-svelte-50'}"
              >
                <Settings class="w-5 h-5" />
                Settings
              </a> -->
            </nav>
          {:else}
            <!-- Divider -->
            <div class="border-t border-svelte-100 my-6 mx-6"></div>

            <!-- Auth links  -->
            <nav class="space-y-1 px-6">
              <a
                href="/"
                class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                  .url.pathname === '/'
                  ? 'bg-svelte-primary text-white'
                  : 'text-gray-700 hover:bg-svelte-50'}"
              >
                <LogIn class="w-5 h-5" />
                Sign In
              </a>
              <a
                href="/auth/register"
                class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {$page
                  .url.pathname === '/auth/register'
                  ? 'bg-svelte-primary text-white'
                  : 'text-gray-700 hover:bg-svelte-50'}"
              >
                <UserPlus class="w-5 h-5" />
                Sign Up
              </a>
            </nav>
          {/if}
        </div>

        <!-- Logout -->
        {#if session}
          <div class="border-t border-svelte-100 p-6">
            <button
              onclick={() => supabase.auth.signOut()}
              type="button"
              class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-svelte-primary hover:bg-svelte-50 w-full text-left"
              aria-label="Logout"
            >
              <LogOut class="w-5 h-5" />
              Sign out
            </button>
          </div>
        {/if}
      </aside>
    </div>
  {/if}
</div>

<Toaster richColors position="bottom-right" />
