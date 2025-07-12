<script>
  import { User, Calendar, Shield, Share2, ExternalLink } from "lucide-svelte";
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  export let data;

  let userData = data.profile;
  let currentUrl = "";

  $: if (typeof window !== "undefined") {
    currentUrl = window.location.href;
  }

  function copyProfileUrl() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      alert("Profile URL copied to clipboard!");
    }
  }

  function shareProfile() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${"Eli Bautista"}'s Profile - ${PUBLIC_APP_NAME}`,
        text: `Check out ${"Eli Bautista"}'s profile on ${PUBLIC_APP_NAME}`,
        url: currentUrl,
      });
    } else {
      copyProfileUrl();
    }
  }
</script>

<svelte:head>
  <title>{"Eli Bautista"}'s Profile - {PUBLIC_APP_NAME}</title>
  <!-- <meta
    name="description"
    content="View {userData.name}'s public profile on {PUBLIC_APP_NAME}"
  />
  <meta
    property="og:title"
    content="{userData.name}'s Profile - {PUBLIC_APP_NAME}"
  />
  <meta
    property="og:description"
    content="View {userData.name}'s public profile on {PUBLIC_APP_NAME}"
  />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:type" content="profile" />
  {#if userData.profilePicture}
    <meta property="og:image" content={userData.profilePicture || ''} />
  {/if} -->
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100">
  <div class="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-6xl">
    <div class="mb-6">
      <a
        href="/"
        class="inline-flex items-center gap-2 text-svelte-primary hover:text-svelte-700 font-medium transition-colors text-sm sm:text-base"
      >
        <ExternalLink class="w-4 h-4" />
        Back to {PUBLIC_APP_NAME}
      </a>
    </div>

    <div class="mb-8 sm:mb-12">
      <div class="flex items-center gap-4 sm:gap-6 justify-center">
        <div
          class="p-3 sm:p-4 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg"
        >
          <User class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div class="text-center sm:text-left">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text"
          >
            {"Eli Bautista"}
          </h1>
          <p
            class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 font-medium"
          >
            {"dev.elibautista@gmail.com"}
          </p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div class="text-center">
            <div class="mb-6">
              <div
                class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-svelte-100 mx-auto"
              >
                <img
                  src={"https://scontent.fmnl9-3.fna.fbcdn.net/v/t39.30808-6/513743490_3202478023244165_5764343989893681401_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGB4_hQkhVilWlmZStkf-Vmd0sTK98BSgZ3SxMr3wFKBiLzStrq0U6wVtGXwbrRD5ygixJvf0VTDQTtYORejIxh&_nc_ohc=NVnMHV1gjHgQ7kNvwEqVYNm&_nc_oc=Adlxz0vluTA5bv9CHGaQcPC5Te14wgCeOene3XdJxQ7Wf2HrQSOcFbapBhsmJFjGqrU&_nc_zt=23&_nc_ht=scontent.fmnl9-3.fna&_nc_gid=gf5mil-6gLxhbSHw2FYD7Q&oh=00_AfTDsJ5Nl9FWUasVHxuyKSm3EHCiuHLw7m4FCYnZuW_IVg&oe=6877EE4C"}
                  alt="{'Eli Bautista'}'s profile"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {"Eli Bautista"}
            </h2>
            <p class="text-gray-600 mb-6">
              {"dev.elibautista@gmail.com"}
            </p>

            <div class="space-y-3">
              <button
                on:click={shareProfile}
                class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Share2 class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="text-sm sm:text-base">Share Profile</span>
              </button>

              <button
                on:click={copyProfileUrl}
                class="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-svelte-primary rounded-xl py-3 shadow-sm hover:shadow-md transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <ExternalLink class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="text-sm sm:text-base">Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        <div
          class="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Info</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Status</span>
              <div class="flex items-center gap-2">
                <Shield class="w-4 h-4 text-green-500" />
                <span class="text-green-600 font-medium">Public</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member Since</span>
              <span class="font-medium text-gray-800">{"July 2025"}</span>
            </div>
            <!-- {#if userData.username} -->
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Username</span>
              <span class="font-medium text-gray-800">@{"@gionapagod"}</span>
            </div>
            <!-- {/if} -->
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Personal Information
          </h3>

          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-2">
              <span
                class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >Full Name</span
              >
              <div
                class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200"
              >
                <User class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{"Eli Bautista"}</span>
              </div>
            </div>

            <div class="space-y-2">
              <span
                class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >Email</span
              >
              <div
                class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200"
              >
                <User class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium"
                  >{"dev.elibautista@gmail.com"}</span
                >
              </div>
            </div>

            <div class="space-y-2 sm:col-span-2">
              <span
                class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >Join Date</span
              >
              <div
                class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200"
              >
                <Calendar class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{"July 2025"}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- {#if userData.bio || "This user does not have a bio yet."} -->
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            About
          </h3>

          <div
            class="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200"
          >
            <p class="text-gray-700 leading-relaxed">
              {"This user does not have a bio yet."}
            </p>
          </div>
        </div>
        <!-- {/if} -->

        <div
          class="bg-gradient-to-r from-svelte-primary to-svelte-secondary rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <h3 class="text-xl sm:text-2xl font-bold mb-4">
            Want to create your own profile?
          </h3>
          <p class="text-svelte-100 mb-6 leading-relaxed">
            Join {PUBLIC_APP_NAME} and create your own shareable profile like {'Eli Bautista'}'s!
          </p>
          <a
            href="/auth/register"
            class="inline-flex items-center gap-2 bg-white text-svelte-primary px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <User class="w-5 h-5" />
            <span>Join {PUBLIC_APP_NAME}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
