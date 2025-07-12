<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import {
        ArrowRight,
        Zap,
        Shield,
        Users,
        Star,
        Settings,
        User,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
  import { onMount } from "svelte";

    export let data;
    let { supabase, session } = data;

    

</script>

<svelte:head>
    <title>Home - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-20">
        <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-5xl font-bold text-gray-800 mb-6">
                Welcome to <span class="text-svelte-primary"
                    >{PUBLIC_APP_NAME}</span
                >
            </h1>

            <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                {session
                    ? `Hello, ${session.user.email}!`
                    : "Your one-stop solution for all your needs. Explore our features and get started today!"
                }
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                    on:click={() => goto("/account/profile")}
                    class="bg-svelte-primary hover:bg-svelte-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    View Profile
                    <User class="w-5 h-5" />
                </button>

                <button
                    on:click={() => goto("/account/settings")}
                    class="bg-white hover:bg-svelte-50 text-gray-700 border border-svelte-200 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    Settings
                    <Settings class="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">
                What you can do with <span class="text-svelte-primary"
                    >{PUBLIC_APP_NAME}</span
                >
            </h2>
            <p class="text-lg text-gray-600">
                Discover the powerful features designed just for you.
            </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
                class="bg-white p-6 rounded-lg shadow-sm border border-svelte-100 text-center hover:shadow-md transition-shadow"
            >
                <Zap class="w-12 h-12 text-svelte-accent mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Lightning Fast
                </h3>
                <p class="text-gray-600">
                    Experience blazing fast performance in everything you do
                </p>
            </div>

            <div
                class="bg-white p-6 rounded-lg shadow-sm border border-svelte-100 text-center hover:shadow-md transition-shadow"
            >
                <Shield class="w-12 h-12 text-svelte-600 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Secure & Private
                </h3>
                <p class="text-gray-600">
                    Your data is protected with enterprise-grade security
                </p>
            </div>

            <div
                class="bg-white p-6 rounded-lg shadow-sm border border-svelte-100 text-center hover:shadow-md transition-shadow"
            >
                <Users class="w-12 h-12 text-svelte-secondary mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Collaborative
                </h3>
                <p class="text-gray-600">
                    Work together with your team seamlessly
                </p>
            </div>

            <div
                class="bg-white p-6 rounded-lg shadow-sm border border-svelte-100 text-center hover:shadow-md transition-shadow"
            >
                <Star class="w-12 h-12 text-svelte-primary mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Premium Quality
                </h3>
                <p class="text-gray-600">
                    Built with attention to detail and user experience
                </p>
            </div>
        </div>
    </div>

    <!-- Getting Started Section -->
    <div class="container mx-auto px-4 py-16">
        <div
            class="bg-white rounded-2xl shadow-sm border border-svelte-100 p-12 text-center max-w-3xl mx-auto"
        >
            <h2 class="text-3xl font-bold text-gray-800 mb-4">
                Ready to get started?
            </h2>
            <p class="text-lg text-gray-600 mb-8">
                Explore your account settings, update your profile, or dive into
                the features that matter most to you.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    on:click={() => goto("/account/profile")}
                    class="bg-svelte-primary hover:bg-svelte-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    Explore Profile
                    <ArrowRight class="w-5 h-5" />
                </button>

                <button
                    on:click={() => goto("/about")}
                    class="bg-svelte-100 hover:bg-svelte-200 text-svelte-primary px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Learn More
                </button>
            </div>
        </div>
    </div>
</div>
