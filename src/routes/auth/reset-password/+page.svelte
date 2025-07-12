<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import {
        Shield,
        Lock,
        Eye,
        EyeOff,
        Check,
        ArrowRight,
    } from "lucide-svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let password = "";
    let confirmPassword = "";
    let showPassword = false;
    let showConfirmPassword = false;
    let isLoading = false;
    let isValidToken = true;
    let isExpired = false;
    let passwordStrength = 0;
    let token = "";

    $: {
        if (password.length === 0) {
            passwordStrength = 0;
        } else if (password.length < 6) {
            passwordStrength = 1;
        } else if (
            password.length < 8 ||
            !/(?=.*[a-z])(?=.*[A-Z])/.test(password)
        ) {
            passwordStrength = 2;
        } else if (!/(?=.*\d)/.test(password)) {
            passwordStrength = 3;
        } else {
            passwordStrength = 4;
        }
    }

    $: passwordsMatch =
        password === confirmPassword && confirmPassword.length > 0;

    onMount(() => {
        token = $page.url.searchParams.get("token") || "";

        if (!token) {
            isValidToken = false;
        } else if (token === "expired") {
            isExpired = true;
            isValidToken = false;
        }
    });

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

    async function handleResetPassword(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (passwordStrength < 3) {
            alert("Please choose a stronger password");
            return;
        }

        isLoading = true;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Password reset successful:", {
            token,
            newPassword: password,
        });

        isLoading = false;
        goto("/");
    }

    function handleRequestNewLink() {
        goto("/forgot-password");
    }
</script>

<svelte:head>
    <title>Reset Password - {PUBLIC_APP_NAME}</title>
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
                    <Shield class="w-8 h-8 text-white" />
                </div>
                <h1 class="text-3xl font-bold text-gray-800">Reset Password</h1>
            </div>

            {#if isValidToken}
                <p class="text-gray-600 text-lg">
                    Create a new secure password for your account.
                </p>
            {/if}
        </div>

        <!-- Content -->
        <div
            class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
            {#if !isValidToken}
                <!-- Invalid/Expired Token -->
                <div class="text-center space-y-6">
                    <div
                        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                    >
                        <Shield class="w-8 h-8 text-red-600" />
                    </div>

                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            {isExpired ? "Link Expired" : "Invalid Link"}
                        </h3>
                        <p class="text-gray-600 mb-4">
                            {isExpired
                                ? "This password reset link has expired. Please request a new one."
                                : "This password reset link is invalid or has already been used."}
                        </p>
                    </div>

                    <button
                        on:click={handleRequestNewLink}
                        class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Request New Link
                        <ArrowRight class="w-5 h-5" />
                    </button>
                </div>
            {:else}
                <!-- Reset Password Form -->
                <form on:submit={handleResetPassword} class="space-y-6">
                    <!-- New Password Field -->
                    <div class="space-y-2">
                        <label
                            for="password"
                            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                        >
                            New Password
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
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                on:click={() =>
                                    togglePasswordVisibility("password")}
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
                        {#if password.length > 0}
                            <div class="space-y-2">
                                <div class="flex gap-1">
                                    {#each Array(4) as _, i}
                                        <div
                                            class="h-2 flex-1 rounded-full {i <
                                            passwordStrength
                                                ? getStrengthColor(
                                                      passwordStrength,
                                                  )
                                                : 'bg-gray-200'}"
                                        ></div>
                                    {/each}
                                </div>
                                <p class="text-xs text-gray-600">
                                    Password strength: <span class="font-medium"
                                        >{getStrengthText(
                                            passwordStrength,
                                        )}</span
                                    >
                                </p>
                                <div class="text-xs text-gray-500 space-y-1">
                                    <div class="flex items-center gap-2">
                                        <Check
                                            class="w-3 h-3 {password.length >= 8
                                                ? 'text-green-500'
                                                : 'text-gray-300'}"
                                        />
                                        <span
                                            class={password.length >= 8
                                                ? "text-green-600"
                                                : "text-gray-400"}
                                            >At least 8 characters</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Check
                                            class="w-3 h-3 {/(?=.*[a-z])(?=.*[A-Z])/.test(
                                                password,
                                            )
                                                ? 'text-green-500'
                                                : 'text-gray-300'}"
                                        />
                                        <span
                                            class={/(?=.*[a-z])(?=.*[A-Z])/.test(
                                                password,
                                            )
                                                ? "text-green-600"
                                                : "text-gray-400"}
                                            >Mixed case letters</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Check
                                            class="w-3 h-3 {/(?=.*\d)/.test(
                                                password,
                                            )
                                                ? 'text-green-500'
                                                : 'text-gray-300'}"
                                        />
                                        <span
                                            class={/(?=.*\d)/.test(password)
                                                ? "text-green-600"
                                                : "text-gray-400"}
                                            >At least one number</span
                                        >
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Confirm Password Field -->
                    <div class="space-y-2">
                        <label
                            for="confirmPassword"
                            class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                        >
                            Confirm New Password
                        </label>
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                            >
                                <Lock class="w-5 h-5 text-svelte-primary" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                bind:value={confirmPassword}
                                required
                                class="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200"
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                on:click={() =>
                                    togglePasswordVisibility("confirm")}
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
                        {#if confirmPassword.length > 0}
                            <div class="flex items-center gap-2 text-xs">
                                {#if passwordsMatch}
                                    <Check class="w-4 h-4 text-green-500" />
                                    <span class="text-green-600"
                                        >Passwords match</span
                                    >
                                {:else}
                                    <span class="text-red-500"
                                        >Passwords do not match</span
                                    >
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Reset Password Button -->
                    <button
                        type="submit"
                        disabled={isLoading ||
                            !passwordsMatch ||
                            passwordStrength < 3}
                        class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {#if isLoading}
                            <div
                                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                            ></div>
                            Resetting password...
                        {:else}
                            Reset Password
                            <ArrowRight class="w-5 h-5" />
                        {/if}
                    </button>
                </form>
            {/if}

            <!-- Footer -->
            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500"
                        >Remember your password?</span
                    >
                </div>
            </div>

            <div class="text-center">
                <a
                    href="/"
                    class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-semibold transition-colors"
                >
                    Back to Sign In
                </a>
            </div>
        </div>
    </div>
</div>
