<script>
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { RotateCcw, Mail, ArrowRight, ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  let email = '';
  let isLoading = false;
  let emailSent = false;

  export let data;

  async function handleForgotPassword(event) {
    event.preventDefault();
    isLoading = true;


    const { error } = await data.supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false, 
        emailRedirectTo: window.location.origin + '/auth/verify-otp'
      }
    });
    
    if (error) {
      toast.error("Failed to send OTP: " + error.message);
    } else {
        toast.success("OTP sent! Check your inbox.");
        emailSent = true;
        goto(`/auth/verify-otp?email=${encodeURIComponent(email)}&purpose=reset`);
    }
    
    isLoading = false;
    emailSent = true;
  }

  function handleResendEmail() {
    emailSent = false;
    email = '';
  }
</script>

<svelte:head>
  <title>Forgot Password - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
          <RotateCcw class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Reset Password</h1>
      </div>
      
      {#if !emailSent}
        <p class="text-gray-600 text-lg">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      {/if}
    </div>

    <!-- Form or Success Message -->
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {#if !emailSent}
        <form on:submit={handleForgotPassword} class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail class="w-5 h-5 text-svelte-primary" />
              </div>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <!-- Send Reset Email Button -->
          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {#if isLoading}
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending reset link...
            {:else}
              Send Reset Link
              <ArrowRight class="w-5 h-5" />
            {/if}
          </button>
        </form>
      {:else}
        <!-- Success Message -->
        <div class="text-center space-y-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail class="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Email Sent!</h3>
            <p class="text-gray-600 mb-4">
              We've sent a password reset link to <span class="font-medium text-gray-800">{email}</span>
            </p>
            <p class="text-sm text-gray-500">
              Check your inbox and click the link to reset your password. The link will expire in 24 hours.
            </p>
          </div>

          <div class="space-y-3">
            <button
              on:click={handleResendEmail}
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
            >
              Send to a different email
            </button>
          </div>
        </div>
      {/if}

      <!-- Back to Login -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Remember your password?</span>
        </div>
      </div>

      <div class="text-center">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Sign In
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-8">
      <p class="text-sm text-gray-500">
        Need help? <a href="/contact" class="text-svelte-primary hover:text-svelte-700 transition-colors">Contact Support</a>
      </p>
    </div>
  </div>
</div> 