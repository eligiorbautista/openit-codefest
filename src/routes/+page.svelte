<script>
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import {
    LogIn,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";

  async function handleGoogleLogin(){
    const { error } = await data.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {redirectTo: window.location.origin + "/home"}
    });

    if(error) toast.error("Google login failed: " + error.message);

    toast.success("Redirecting to Google login...");
  }

  let email = "";
  let password = "";
  let showPassword = false;
  let isLoading = false;

  export let data;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  async function handleLogin(event) {
    event.preventDefault();
    isLoading = true;
    
    try {
      const { data: authData, error } = await data.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Login failed: " + error.message);
        return;
      }
      
      // Check if user has 2FA enabled
      const user = authData.user;
      const has2FA = user.user_metadata?.two_factor_enabled === true;
      
      if (has2FA) {
        // Sign out temporarily and send 2FA code
        await data.supabase.auth.signOut();
        
        // Send 2FA code
        const { error: otpError } = await data.supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false
          }
        });
        
        if (otpError) {
          toast.error("Failed to send 2FA code: " + otpError.message);
        } else {
          toast.success("2FA code sent to your email");
          goto(`/auth/verify-2fa?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        }
      } else {
        toast.success("Successfully logged in!");
        goto("/home");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div
          class="p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg"
        >
          <LogIn class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
      </div>
      <p class="text-gray-600 text-lg">
        Sign in to your <span class="text-svelte-primary font-semibold"
          >{PUBLIC_APP_NAME}</span
        > account
      </p>
    </div>

    <!-- Login Form -->
    <div
      class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <form on:submit={handleLogin} class="space-y-6">
        <!-- Email Field -->
        <div class="space-y-2">
          <label
            for="email"
            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            Email Address
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <Mail class="w-5 h-5 text-svelte-primary" />
            </div>
            <input
              type="email"
              id="email"
              bind:value={email}
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label
            for="password"
            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
          >
            Password
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-svelte-primary" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              bind:value={password}
              required
              class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              on:click={togglePasswordVisibility}
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-svelte-primary transition-colors"
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-end">
          <a
            href="/forgot-password"
            class="text-sm text-svelte-primary hover:text-svelte-700 font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <div
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            Signing in...
          {:else}
            Sign In
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>
      </form>

      <!-- Social Login Divider -->
      <!-- <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div> -->

      <!-- Google Login Button -->
      <!-- <button
        type="button"
        on:click={handleGoogleLogin}
        class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button> -->

      <!-- Register Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500"
            >New to {PUBLIC_APP_NAME}?</span
          >
        </div>
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <a
          href="/auth/register"
          class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors"
        >
          Create an account
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- Footer -->
    <!-- <div class="text-center mt-8">
      <p class="text-sm text-gray-500">
        By signing in, you agree to our
        <a
          href="/terms"
          class="text-svelte-primary hover:text-svelte-700 transition-colors"
          >Terms of Service</a
        >
        and
        <a
          href="/privacy"
          class="text-svelte-primary hover:text-svelte-700 transition-colors"
          >Privacy Policy</a
        >
      </p>
    </div> -->
  </div>
</div>
