<script>
  import { goto } from "$app/navigation";
  export let data;
  import { page } from "$app/stores";
  import { supabase } from "@supabase/auth-ui-shared";
  import { User } from "lucide-svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  const reward_id = $page.params.id;

  let rewardDetails = [];
  let isLoading = false;

  console.log(reward_id);

  let editFormData = {
    name: '',
    description: '',
    points_requirement : ''
  }

  onMount(() => {
    if(rewardDetails != []){
        editFormData.name = rewardDetails.name;
        editFormData.description = rewardDetails.description;
        editFormData.points_requirement = rewardDetails.points_requirement;
    }

    console.log(editFormData);
  })

  async function fetchRewardById() {
    try {
      const { data: rewardData, error: rewardError } = await data.supabase
        .from("rewards")
        .select("*")
        .eq("id", reward_id)
        .single();

      if (rewardError) {
        console.log("error fetching reward: ", rewardError);
      }

      rewardDetails = rewardData || [];
      console.log("reward details: ", rewardDetails);
    } catch (error) {
      console.log("Error fetching reward details: ", error);
    }
  }

  

  console.log(editFormData);

  async function updateRewardDetail(){
    const { data: updateRewardData, error: updateRewardError} = await data.supabase
        .from('rewards')
        .update({
            name: rewardDetails.name,
            description: rewardDetails.description,
            points_requirement: rewardDetails.points_requirement,
        })
        .select()
        .single();

    if(updateRewardError){
        console.error("error updating rewards", updateRewardError);
    }

    console.log("Edited successfully: ", updateRewardData);
    toast.success("Reward edited successfully");
    goto("/users/ad/rewards");
  }

  onMount(() => {
    fetchRewardById();
  });
</script>


<div
  class="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
>
  <form on:submit={updateRewardDetail} class="space-y-4 sm:space-y-5">
    <!-- Name Fields -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label
          for="nam"
          class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
        >
          Name
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
          >
            <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
          </div>
          <input
            type="text"
            id="name"
            bind:value={rewardDetails.name}
            required
            class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter your first name"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label
          for="description"
          class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
        >
          Description
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
          >
            <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
          </div>
          <input
            type="text"
            id="description"
            bind:value={rewardDetails.description}
            required
            class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter your description"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label
          for="points_requirement"
          class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
        >
          Points Required
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
          >
            <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
          </div>
          <input
            type="number"
            id="points_requirement"
            bind:value={rewardDetails.points_requirement}
            required
            class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
            placeholder="Enter points required"
          />
        </div>
      </div>
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
        <span class="text-sm sm:text-base">Updating account...</span>
      {:else}
        <span class="text-sm sm:text-base">Update Account</span>
      {/if}
    </button>
  </form>
</div>
