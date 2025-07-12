<script>
    import { Home, ArrowLeft, Search, HelpCircle } from "lucide-svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { PUBLIC_APP_NAME } from "$env/static/public";

    $: is404 = $page.status === 404;
    $: errorTitle = is404 ? "Page Not Found" : "Oops! Something went wrong";
    $: errorMessage = is404
        ? "Sorry, we couldn't find the page you're looking for."
        : "An unexpected error occurred. Please try again later.";

    function goHome() {
        goto("/");
    }

    function goBack() {
        if (typeof window !== "undefined" && window.history.length > 1) {
            history.back();
        } else {
            goto("/");
        }
    }
</script>

<svelte:head>
    <title>{errorTitle} - {PUBLIC_APP_NAME}</title>
    <meta name="description" content={errorMessage} />
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
    <div class="max-w-2xl mx-auto text-center">
        <!-- Error Icon and Status -->
        <div class="mb-8">
            <div
                class="p-6 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-xl"
            >
                {#if is404}
                    <Search class="w-16 h-16 text-white" />
                {:else}
                    <HelpCircle class="w-16 h-16 text-white" />
                {/if}
            </div>

            <h1 class="text-6xl font-bold text-gray-800 mb-4">
                {#if is404}
                    404
                {:else}
                    {$page.status || "Error"}
                {/if}
            </h1>

            <h2 class="text-3xl font-semibold text-gray-700 mb-4">
                {errorTitle}
            </h2>

            <p
                class="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
            >
                {errorMessage}
                {#if is404}
                    The page you're looking for might have been moved, deleted,
                    or doesn't exist.
                {/if}
            </p>
        </div>

        <!-- Action Buttons -->
        <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
            <button
                on:click={goHome}
                class="bg-svelte-primary hover:bg-svelte-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
                <Home class="w-5 h-5" />
                Go Home
            </button>

            <button
                on:click={goBack}
                class="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
                <ArrowLeft class="w-5 h-5" />
                Go Back
            </button>
        </div>

        <!-- Technical Details (dev) -->
        {#if $page.error && typeof $page.error === "object"}
            <details
                class="mt-8 bg-gray-100 rounded-lg p-4 text-left max-w-lg mx-auto"
            >
                <summary class="cursor-pointer font-medium text-gray-700 mb-2">
                    Technical Details
                </summary>
                <pre
                    class="text-sm text-gray-600 whitespace-pre-wrap break-words">
{JSON.stringify($page.error, null, 2)}
        </pre>
            </details>
        {/if}
    </div>
</div>
