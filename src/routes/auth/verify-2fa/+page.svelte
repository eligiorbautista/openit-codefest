<script>
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { Shield, ArrowRight, RotateCcw } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let otpCode = '';
  let email = '';
  let password = '';
  let isLoading = false;
  let isResending = false;
  let timeLeft = 300;
  let timerInterval;
  let otpInput;

  export let data;

  onMount(() => {
    email = $page.url.searchParams.get('email') || '';
    password = $page.url.searchParams.get('password') || '';
    
    if (!email || !password) {
      toast.error('Invalid 2FA session');
      goto('/');
      return;
    }

    startTimer();
    if (otpInput) otpInput.focus();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) clearInterval(timerInterval);
    }, 1000);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function handleInput(event) {
    const value = event.target.value;
    const digits = value.replace(/\D/g, '').slice(0, 6);
    otpCode = digits;
  }

  async function handleVerify2FA(event) {
    event.preventDefault();
    if (otpCode.length !== 6) return;
    
    isLoading = true;

    try {
      // First verify the OTP
      const { data: authData, error: verifyError } = await data.supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email'
      });

      if (verifyError) {
        toast.error(verifyError.message || 'Invalid 2FA code');
        otpCode = '';
        otpInput?.focus();
        return;
      }

      // If OTP is valid, now sign in with password
      const { error: signInError } = await data.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        toast.error('Login failed: ' + signInError.message);
        goto('/');
        return;
      }

      toast.success('2FA verification successful!');
      goto('/home');
    } catch (err) {
      toast.error('2FA verification failed. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  async function handleResend() {
    isResending = true;
    
    const { error } = await data.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });

    if (error) {
      toast.error('Failed to resend code: ' + error.message);
    } else {
      toast.success('New 2FA code sent!');
      timeLeft = 300;
      startTimer();
      otpCode = '';
      otpInput?.focus();
    }
    
    isResending = false;
  }
</script>

<svelte:head>
  <title>Two-Factor Authentication - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
          <Shield class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Two-Factor Authentication</h1>
      </div>
      
      <p class="text-gray-600 text-lg mb-2">
        We've sent a 6-digit code to
      </p>
      <p class="text-gray-800 font-semibold text-lg mb-4">{email}</p>
      <p class="text-gray-500 text-sm">
        Enter the code to complete your login
      </p>
    </div>

    <!-- Verification Form -->
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <form on:submit={handleVerify2FA} class="space-y-6">
        <!-- OTP Input -->
        <div class="space-y-4">
          <div class="flex justify-center">
            <input
              bind:this={otpInput}
              bind:value={otpCode}
              on:input={handleInput}
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="Enter 6-digit code"
              class="w-full max-w-xs text-center text-2xl font-bold tracking-widest bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-800 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          
          <!-- Timer -->
          {#if timeLeft > 0}
            <p class="text-center text-sm text-gray-500">
              Code expires in <span class="font-medium text-svelte-primary">{formatTime(timeLeft)}</span>
            </p>
          {:else}
            <p class="text-center text-sm text-red-500 font-medium">
              Code has expired
            </p>
          {/if}
        </div>

        <!-- Verify Button -->
        <button
          type="submit"
          disabled={otpCode.length !== 6 || isLoading || timeLeft <= 0}
          class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          {:else}
            Verify & Sign In
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>
      </form>

      <!-- Resend Code -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
        <button
          on:click={handleResend}
          disabled={isResending || timeLeft > 240}
          class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isResending}
            <div class="w-4 h-4 border-2 border-svelte-primary border-t-transparent rounded-full animate-spin"></div>
            Sending...
          {:else}
            <RotateCcw class="w-4 h-4" />
            Resend code
          {/if}
        </button>
        
        {#if timeLeft > 240}
          <p class="text-xs text-gray-400 mt-1">
            Available in {formatTime(timeLeft - 240)}
          </p>
        {/if}
      </div>
    </div>

    <!-- Back to Login -->
    <div class="text-center mt-6">
      <a
        href="/"
        class="text-sm text-gray-500 hover:text-svelte-primary transition-colors"
      >
        ← Back to Sign In
      </a>
    </div>
  </div>
</div>