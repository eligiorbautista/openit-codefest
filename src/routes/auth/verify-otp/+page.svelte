<script>
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { Shield, ArrowRight, RotateCcw, Check } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { createBrowserClient } from '@supabase/ssr';
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
  import { toast } from 'svelte-sonner';

  let otpCode = '';
  let newPassword = '';
  let isLoading = false;
  let isResending = false;
  let isVerified = false;
  let email = '';
  let purpose = 'verification'; // 'verification', '2fa', 'login', 'reset'
  let timeLeft = 300; 
  let timerInterval;
  let otpInput;
  let passwordInput;

  export let data;

  $: isComplete = otpCode.length === 6 && /^\d{6}$/.test(otpCode) && newPassword.length >= 6;

  onMount(() => {
    email = $page.url.searchParams.get('email') || 'user@example.com';
    purpose = $page.url.searchParams.get('purpose') || 'reset';

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

  async function handleVerifyOTP(event = null) {
    if (event) event.preventDefault();
    if (!isComplete) return;
    isLoading = true;

    // First verify the OTP
    const { data: authData, error: verifyError } = await data.supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email' 
    });

    if (verifyError) {
      toast.error(verifyError.message || 'Invalid OTP code.');
      otpCode = '';
      otpInput?.focus();
      isLoading = false;
      return;
    }

    // If OTP is valid, update the password
    const { error: updateError } = await data.supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      toast.error('Failed to update password: ' + updateError.message);
    } else {
      isVerified = true;
      toast.success('Password reset successful!');
      setTimeout(() => goto('/'), 2000);
    }

    isLoading = false;
  }

  async function handleResendOTP() {
    isResending = true;
    const { error } = await data.supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin + '/auth/verify-otp'
      }
    });

    if (error) {
      toast.error('Failed to resend OTP: ' + error.message);
    } else {
      toast.success('New OTP sent! Check your inbox.');
      timeLeft = 300;
      startTimer();
      otpCode = '';
      otpInput?.focus();
    }

    isResending = false;
  }

  function getPurposeText() {
    switch (purpose) {
      case 'reset':
        return 'password reset';
      case '2fa':
        return 'two-factor authentication';
      case 'login':
        return 'secure login';
      case 'verification':
      default:
        return 'email verification';
    }
  }
</script>

<svelte:head>
  <title>Verify Code - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
          <Shield class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Verify Code</h1>
      </div>
      
      {#if !isVerified}
        <p class="text-gray-600 text-lg mb-2">
          We've sent a 6-digit code to
        </p>
        <p class="text-gray-800 font-semibold text-lg mb-4">{email}</p>
        <p class="text-gray-500 text-sm">
          Enter the code for {getPurposeText()}
        </p>
      {/if}
    </div>

    <!-- Verification Form -->
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {#if !isVerified}
        <form on:submit={handleVerifyOTP} class="space-y-6">
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
            <!-- New Password Input -->
            <div class="flex justify-center">
              <input
                bind:this={passwordInput}
                bind:value={newPassword}
                type="password"
                minlength="6"
                placeholder="Enter new password"
                class="w-full max-w-xs text-center text-lg bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-800 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
                disabled={isLoading}
                required
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
            disabled={!isComplete || isLoading || timeLeft <= 0}
            class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {#if isLoading}
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            {:else}
              Reset Password
              <ArrowRight class="w-5 h-5" />
            {/if}
          </button>
        </form>

        <!-- Resend Code -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
          <button
            on:click={handleResendOTP}
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
      {:else}
        <!-- Success State -->
        <div class="text-center space-y-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check class="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Verified!</h3>
            <p class="text-gray-600 mb-4">
              Your password reset was successful.
            </p>
            <p class="text-sm text-gray-500">
              Redirecting you to sign in...
            </p>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-svelte-primary to-svelte-secondary h-2 rounded-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>
      {/if}

      <!-- Help -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          Having trouble? <a href="/contact" class="text-svelte-primary hover:text-svelte-700 transition-colors">Contact Support</a>
        </p>
      </div>
    </div>

    <!-- Back Navigation -->
    {#if !isVerified}
      <div class="text-center mt-6">
        <a
          href="/"
          class="text-sm text-gray-500 hover:text-svelte-primary transition-colors"
        >
          ← Back to Sign In
        </a>
      </div>
    {/if}
  </div>
</div>