<script>
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';


  export let data;

  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };
  
  let showPassword = false;
  let showConfirmPassword = false;
  let agreeToTerms = false;
  let isLoading = false;
  let passwordStrength = 0;

  $: { 
    if (formData.password.length === 0) {
      passwordStrength = 0;
    } else if (formData.password.length < 6) {
      passwordStrength = 1;
    } else if (formData.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      passwordStrength = 2;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      passwordStrength = 3;
    } else {
      passwordStrength = 4;
    }
  }

  $: passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  function togglePasswordVisibility(field) {
    if (field === 'password') {
      showPassword = !showPassword;
    } else {
      showConfirmPassword = !showConfirmPassword;
    }
  }

  function getStrengthColor(strength) {
    const colors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
    return colors[strength] || 'bg-gray-200';
  }

  function getStrengthText(strength) {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[strength] || '';
  }


  // NEW: UPDATED REGISTER FUNCTION
  async function handleRegister(event) {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    isLoading = true;

  try {
    const { data: signUpData, error } = await data.supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone
        }
      }
    });
    if (error) toast.error("Registration failed: " + error.message);
    else {
      toast.success("Registration successful! Please check your email for verification.");
    }
  } 
  catch (err) {
    toast.error("Registration failed. Please try again.");
  }
  finally {
    isLoading = false;
  }
  }
</script>

<svelte:head>
  <title>Register - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-lg">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
          <UserPlus class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Join {PUBLIC_APP_NAME}</h1>
      </div>
      <p class="text-gray-600 text-lg">
        Create your account and start your journey with us
      </p>
    </div>

    <!-- Registration Form -->
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <form on:submit={handleRegister} class="space-y-6">
        <!-- Name Fields -->

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="firstName" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              First Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User class="w-5 h-5 text-svelte-primary" />
              </div>
              <input
                type="text"
                id="firstName"  
                bind:value={formData.firstName}
                required
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
                placeholder="First name"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="lastName" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              bind:value={formData.lastName}
              required
              class="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Last name"
            />
          </div>
        </div>

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
              bind:value={formData.email}
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Phone Field -->
        <div class="space-y-2">
          <label for="phone" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Phone Number
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone class="w-5 h-5 text-svelte-primary" />
            </div>
            <input
              type="tel"
              id="phone"
              bind:value={formData.phone}
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label for="password" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock class="w-5 h-5 text-svelte-primary" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              bind:value={formData.password}
              required
              class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Create a password"
            />
            <button
              type="button"
              on:click={() => togglePasswordVisibility('password')}
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-svelte-primary transition-colors"
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
          
          <!-- Password Strength Indicator -->
          {#if formData.password.length > 0}
            <div class="space-y-2">
              <div class="flex gap-1">
                {#each Array(4) as _, i}
                  <div class="h-2 flex-1 rounded-full {i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'}"></div>
                {/each}
              </div>
              <p class="text-xs text-gray-600">
                Password strength: <span class="font-medium">{getStrengthText(passwordStrength)}</span>
              </p>
            </div>
          {/if}
        </div>

        <!-- Confirm Password Field -->
        <div class="space-y-2">
          <label for="confirmPassword" class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Confirm Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock class="w-5 h-5 text-svelte-primary" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              bind:value={formData.confirmPassword}
              required
              class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              on:click={() => togglePasswordVisibility('confirm')}
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-svelte-primary transition-colors"
            >
              {#if showConfirmPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
          
          <!-- Password Match Indicator -->
          {#if formData.confirmPassword.length > 0}
            <div class="flex items-center gap-2 text-xs">
              {#if passwordsMatch}
                <Check class="w-4 h-4 text-green-500" />
                <span class="text-green-600">Passwords match</span>
              {:else}
                <span class="text-red-500">Passwords do not match</span>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Terms Agreement -->
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            bind:checked={agreeToTerms}
            required
            class="w-4 h-4 text-svelte-primary bg-gray-100 border-gray-300 rounded focus:ring-svelte-primary focus:ring-2 mt-0.5"
          />
          <label for="terms" class="text-sm text-gray-600">
            I agree to the 
            <a href="/terms" class="text-svelte-primary hover:text-svelte-700 font-medium transition-colors">Terms of Service</a>
            and 
            <a href="/privacy" class="text-svelte-primary hover:text-svelte-700 font-medium transition-colors">Privacy Policy</a>
          </label>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating account...
          {:else}
            Create Account
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Already have an account?</span>
        </div>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors"
        >
          Sign in instead
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</div> 