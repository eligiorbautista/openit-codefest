<script>
  import { Shield, ArrowLeft, Home } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { PUBLIC_APP_NAME } from '$env/static/public';

  export let data;

  // Get the reason from URL params or use a default message
  $: reason = $page.url.searchParams.get('reason') || 'You do not have permission to access this page.';
  $: requiredRole = $page.url.searchParams.get('role') || '';

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      history.back();
    } else {
      goto('/dashboard');
    }
  }

  function goHome() {
    goto('/dashboard');
  }
</script>

<svelte:head>
  <title>Access Denied - {PUBLIC_APP_NAME}</title>
  <meta name="description" content="Access denied - insufficient permissions" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
  <div class="max-w-2xl mx-auto text-center">
    <!-- Error Icon -->
    <div class="mb-8">
      <div class="p-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-xl">
        <Shield class="w-16 h-16 text-white" />
      </div>

      <h1 class="text-6xl font-bold text-gray-800 mb-4">403</h1>
      <h2 class="text-3xl font-semibold text-gray-700 mb-4">Access Denied</h2>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p class="text-lg text-gray-600 mb-4">{reason}</p>
        
        {#if requiredRole}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-700">
              <strong>Required Role:</strong> {requiredRole}
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        on:click={goBack}
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
        Go Back
      </button>
      
      <button
        on:click={goHome}
        class="flex items-center justify-center gap-2 px-6 py-3 bg-svelte-primary hover:bg-svelte-700 text-white rounded-lg font-medium transition-colors"
      >
        <Home class="w-5 h-5" />
        Go to Dashboard
      </button>
    </div>

    <!-- Help Text -->
    <div class="mt-8 text-sm text-gray-500">
      <p>If you believe this is an error, please contact your system administrator.</p>
      <p class="mt-2">
        Need help? <a href="/support" class="text-svelte-primary hover:underline">Contact Support</a>
      </p>
    </div>
  </div>
</div> 