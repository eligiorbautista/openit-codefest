<script>
  import { isAdmin, isTeamLeader, isMember, getRoleName } from '$lib/auth/roles.js';
  import { Shield, Crown, User, CheckCircle, XCircle } from 'lucide-svelte';

  export let data;

  $: userRole = data.profile ? getRoleName(data.profile) : null;
  $: canAdmin = data.profile ? isAdmin(data.profile) : false;
  $: canTL = data.profile ? isTeamLeader(data.profile) || isAdmin(data.profile) : false;
  $: canMember = data.profile ? isMember(data.profile) || isTeamLeader(data.profile) || isAdmin(data.profile) : false;

  const testResults = [
    { label: 'Admin Routes', access: canAdmin, icon: Shield },
    { label: 'Team Leader Routes', access: canTL, icon: Crown },
    { label: 'Member Routes', access: canMember, icon: User },
  ];
</script>

<svelte:head>
  <title>Role Access Test</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Role-Based Access Control Test</h1>
    
    {#if data.session}
      <div class="grid gap-6 md:grid-cols-2">
        <!-- User Information -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
          <div class="space-y-3">
            <div>
              <span class="text-gray-600">Email:</span>
              <span class="font-medium ml-2">{data.session.user.email}</span>
            </div>
            <div>
              <span class="text-gray-600">User ID:</span>
              <span class="font-mono text-sm ml-2">{data.session.user.id}</span>
            </div>
            {#if userRole}
              <div>
                <span class="text-gray-600">Role:</span>
                <span class="font-medium ml-2 px-2 py-1 bg-svelte-100 text-svelte-700 rounded-full text-sm">
                  {userRole}
                </span>
              </div>
              <div>
                <span class="text-gray-600">Role ID:</span>
                <span class="font-mono text-sm ml-2">{data.profile.role_id}</span>
              </div>
            {:else}
              <div>
                <span class="text-gray-600">Role:</span>
                <span class="font-medium ml-2 text-red-600">No role assigned</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Access Control Test Results -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Access Control Test</h2>
          <div class="space-y-3">
            {#each testResults as { label, access, icon }}
              <div class="flex items-center justify-between p-3 border rounded-lg">
                <div class="flex items-center gap-3">
                  <svelte:component this={icon} class="w-5 h-5 text-gray-600" />
                  <span class="font-medium">{label}</span>
                </div>
                <div class="flex items-center gap-2">
                  {#if access}
                    <CheckCircle class="w-5 h-5 text-green-500" />
                    <span class="text-green-600 font-medium">Allowed</span>
                  {:else}
                    <XCircle class="w-5 h-5 text-red-500" />
                    <span class="text-red-600 font-medium">Denied</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Navigation Links Test -->
      <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Navigation Links Test</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <a
            href="/users/ad"
            class="flex items-center gap-3 p-4 border rounded-lg transition-colors {canAdmin
              ? 'border-green-200 bg-green-50 hover:bg-green-100'
              : 'border-red-200 bg-red-50 cursor-not-allowed'}"
          >
            <Shield class="w-5 h-5" />
            <div>
              <div class="font-medium">Admin Routes</div>
              <div class="text-sm text-gray-600">
                {canAdmin ? 'Click to test' : 'Access denied'}
              </div>
            </div>
          </a>

          <a
            href="/users/tl"
            class="flex items-center gap-3 p-4 border rounded-lg transition-colors {canTL
              ? 'border-green-200 bg-green-50 hover:bg-green-100'
              : 'border-red-200 bg-red-50 cursor-not-allowed'}"
          >
            <Crown class="w-5 h-5" />
            <div>
              <div class="font-medium">Team Leader Routes</div>
              <div class="text-sm text-gray-600">
                {canTL ? 'Click to test' : 'Access denied'}
              </div>
            </div>
          </a>

          <a
            href="/users/me"
            class="flex items-center gap-3 p-4 border rounded-lg transition-colors {canMember
              ? 'border-green-200 bg-green-50 hover:bg-green-100'
              : 'border-red-200 bg-red-50 cursor-not-allowed'}"
          >
            <User class="w-5 h-5" />
            <div>
              <div class="font-medium">Member Routes</div>
              <div class="text-sm text-gray-600">
                {canMember ? 'Click to test' : 'Access denied'}
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Raw Profile Data (for debugging) -->
      <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Raw Profile Data (Debug)</h2>
        <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify(data.profile, null, 2)}
        </pre>
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Not Logged In</h2>
        <p class="text-gray-600 mb-4">Please log in to test the role-based access control.</p>
        <a href="/" class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors">
          Log In
        </a>
      </div>
    {/if}
  </div>
</div> 