<script>
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import {
    UserPlus,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Phone,
    ArrowRight,
    Check,
    Users,
    Crown,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import avatar from "daisyui/components/avatar/index.js";


  export let data;

  let userRoles = [];
  let formData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    teamRole: "member",
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
    } else if (
      formData.password.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)
    ) {
      passwordStrength = 2;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      passwordStrength = 3;
    } else {
      passwordStrength = 4;
    }
  }

  $: passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  
  
  function togglePasswordVisibility(field) {
    if (field === "password") {
      showPassword = !showPassword;
    } else {
      showConfirmPassword = !showConfirmPassword;
    }
  }

  function getStrengthColor(strength) {
    const colors = [
      "bg-gray-200",
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-green-400",
    ];
    return colors[strength] || "bg-gray-200";
  }

  function getStrengthText(strength) {
    const texts = ["", "Weak", "Fair", "Good", "Strong"];
    return texts[strength] || "";
  }

  async function getRoles(){
    const {data: rolesData, error: rolesError} = await data.supabase.from('roles').select(`*`)

    if(rolesError){
      console.log("Error: ", rolesError);
    }
    else{
      userRoles = rolesData ?? [];
      console.log("Fetched user roles", userRoles);
    }
  }

  onMount(() => {
    getRoles();
  })


  async function handleRegister(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    isLoading = true;

    try {
      const { data: signUpData, error } = await data.supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            role_id:
              formData.teamRole == "member"
                ? "d41c0b3c-578e-417d-9842-2d955fa8ec18"
                : "f8ef63a0-79ce-4fd2-b832-259a45a8fe94",
            profile_picture: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&bold=true`,
          },
        },
      });
      if (error) toast.error("Registration failed: " + error.message);
      else {
        toast.success(
          "Registration successful! Please check your email for verification."
        );
        // // get userID eq email
        // const { data: userData, error: userError } = await data.supabase
        //   .from("profiles")
        //   .select("id")
        //   .eq("email", formData.email)
        //   .single();

        // if (userError) {
        //   toast.error("Failed to retrieve user ID: " + userError.message);
        // }

        // // upload default avatar
        // const { data: uploadData, error: uploadError } =
        //   await data.supabase.storage
        //     .from("users-avatars")
        //     .upload(`public/${userData.id}/avatar.png`, new Blob(), {
        //       upsert: false,
        //       cacheControl: "3600",
        //       contentType: "image/png",
        //     });

        // // get public url of the uploaded avatar
        // const { publicURL, error: urlError } = data.supabase.storage
        //   .from("users-avatars")
        //   .getPublicUrl(`public/${userData.id}/avatar.png`);
        // if (urlError) {
        //   toast.error("Failed to get avatar URL: " + urlError.message);
        // } else {
        //   // update user profile with avatar URL
        //   const { error: profileError } = await data.supabase
        //     .from("profiles")
        //     .update({ avatar_url: publicURL })
        //     .eq("id", userData.id);

        //   if (profileError) {
        //     toast.error(
        //       "Failed to update profile with avatar URL: " +
        //         profileError.message
        //     );
        //   } else {
        //     toast.success("Avatar uploaded and profile updated successfully!");
        //   }
        // }
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Register - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-6 sm:py-8"
>
  <div class="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-6 sm:mb-8">
      <div class="flex items-center justify-center gap-3 mb-4 sm:mb-6">
        <div
          class="p-2 sm:p-3 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg"
        >
          <UserPlus class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
          Join {PUBLIC_APP_NAME}
        </h1>
      </div>
      <p class="text-gray-600 text-base sm:text-lg">
        Create your account and start your journey with us
      </p>
    </div>

    <!-- Registration Form -->
    <div
      class="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <form on:submit={handleRegister} class="space-y-4 sm:space-y-5">
        <!-- Name Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              for="firstName"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              First Name
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="text"
                id="firstName"
                bind:value={formData.firstName}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your first name"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="lastName"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Last Name
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="text"
                id="lastName"
                bind:value={formData.lastName}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your last name"
              />
            </div>
          </div>
        </div>

        <!-- Team Role Selection -->
        <div class="space-y-2">
          <label
            class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            for="
            teamRole"
          >
            Team Role
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="relative">
              <input
                type="radio"
                name="teamRole"
                value="member"
                bind:group={formData.teamRole}
                class="sr-only"
                id="teamRoleMember"
              />
              <div
                class="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 {formData.teamRole ===
                'member'
                  ? 'border-svelte-primary bg-svelte-50 ring-2 ring-svelte-primary/20'
                  : ''}"
              >
                <Users
                  class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary flex-shrink-0"
                />
                <span class="font-medium text-gray-700 text-sm sm:text-base"
                  >Member</span
                >
              </div>
            </label>

            <label class="relative">
              <input
                type="radio"
                name="teamRole"
                value="team_leader"
                bind:group={formData.teamRole}
                class="sr-only"
              />
              <div
                class="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 {formData.teamRole ===
                'team_leader'
                  ? 'border-svelte-primary bg-svelte-50 ring-2 ring-svelte-primary/20'
                  : ''}"
              >
                <Crown
                  class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary flex-shrink-0"
                />
                <span class="font-medium text-gray-700 text-sm sm:text-base"
                  >Team Leader</span
                >
              </div>
            </label>
          </div>
        </div>

        <!-- Contact Fields -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Email Field -->
          <div class="space-y-2">
            <label
              for="email"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Email Address
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <Mail class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Phone Field -->
          <div class="space-y-2">
            <label
              for="phone"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Phone Number
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <Phone class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        <!-- Password Fields -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Password Field -->
          <div class="space-y-2">
            <label
              for="password"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Password
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <Lock class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                bind:value={formData.password}
                required
                class="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Create a password"
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility("password")}
                class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-svelte-primary transition-colors"
              >
                {#if showPassword}
                  <EyeOff class="w-4 h-4 sm:w-5 sm:h-5" />
                {:else}
                  <Eye class="w-4 h-4 sm:w-5 sm:h-5" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label
              for="confirmPassword"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Confirm Password
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <Lock class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                bind:value={formData.confirmPassword}
                required
                class="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                on:click={() => togglePasswordVisibility("confirm")}
                class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-svelte-primary transition-colors"
              >
                {#if showConfirmPassword}
                  <EyeOff class="w-4 h-4 sm:w-5 sm:h-5" />
                {:else}
                  <Eye class="w-4 h-4 sm:w-5 sm:h-5" />
                {/if}
              </button>
            </div>
          </div>
        </div>

        <!-- Password Indicators Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Password Strength Indicator -->
          <div class="space-y-2">
            {#if formData.password.length > 0}
              <div class="space-y-1">
                <div class="flex gap-1">
                  {#each Array(4) as _, i}
                    <div
                      class="h-2 flex-1 rounded-full {i < passwordStrength
                        ? getStrengthColor(passwordStrength)
                        : 'bg-gray-200'}"
                    ></div>
                  {/each}
                </div>
                <p class="text-xs text-gray-600">
                  Password strength: <span class="font-medium"
                    >{getStrengthText(passwordStrength)}</span
                  >
                </p>
              </div>
            {/if}
          </div>

          <!-- Password Match Indicator -->
          <div class="space-y-2">
            {#if formData.confirmPassword.length > 0}
              <div class="flex items-center gap-2 text-xs pt-2">
                {#if passwordsMatch}
                  <Check class="w-4 h-4 text-green-500" />
                  <span class="text-green-600">Passwords match</span>
                {:else}
                  <span class="text-red-500">Passwords do not match</span>
                {/if}
              </div>
            {/if}
          </div>
        </div>

        <!-- Terms Agreement -->
        <div class="flex items-start gap-3 pt-2">
          <label class="relative flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="terms"
              bind:checked={agreeToTerms}
              required
              class="sr-only peer"
            />
            <div
              class="w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-lg peer-checked:bg-svelte-primary peer-checked:border-svelte-primary peer-focus:ring-2 peer-focus:ring-svelte-primary/20 peer-focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
            >
              {#if agreeToTerms}
                <Check class="w-3 h-3 text-white" />
              {/if}
            </div>
          </label>
          <label
            for="terms"
            class="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer"
          >
            I agree to the
            <a
              href="/terms"
              class="text-svelte-primary hover:text-svelte-700 font-medium transition-colors"
              >Terms of Service</a
            >
            and
            <a
              href="/privacy"
              class="text-svelte-primary hover:text-svelte-700 font-medium transition-colors"
              >Privacy Policy</a
            >
          </label>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <div
              class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-sm sm:text-base">Creating account...</span>
          {:else}
            <span class="text-sm sm:text-base">Create Account</span>
            <ArrowRight class="w-4 h-4 sm:w-5 sm:h-5" />
          {/if}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-5 sm:my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500"
            >Already have an account?</span
          >
        </div>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors text-sm sm:text-base"
        >
          Sign in instead
          <ArrowRight class="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>
    </div>
  </div>
</div>
