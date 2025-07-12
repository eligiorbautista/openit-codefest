<script>
  import { Trophy } from '@lucide/svelte';
  import { supabase } from '@supabase/auth-ui-shared';
  import { User } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
    export let data;
    
    let achievements =  [];
    let fileInput;
    let uploading =  false;
    let isLoading = false;
    let hasBadgeLogo = false;

    console.log(hasBadgeLogo);
    let formData = {
        name : achievements.name || '',
        description: achievements.description || '',
        badge_logo : '',
    }
    

    async function fetchAchievements(){
        const {data: achievementsData, error: achievementsError} = await data.supabase
            .from('achievements')
            .select('*')
        

        if(achievementsError){
            console.log("Error fetching achievements: ", achievementsError);
        }

        achievements = achievementsData ?? [];
        console.log("achievements: ", achievements);
    }

    onMount(() => {
        fetchAchievements();

        console.log("Form Data: ",  formData);
    })

    const handleCreateAchievements = () => {
      goto('/users/ad/achievements/create');
    };

</script>


<div class="p-5">
    <h1 class="text-xl font-bold">ACHIEVEMENTS</h1>

    {#each achievements as achievement}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200"
              on:click={() => goto(`/users/ad/achievements/update/${achievement.id}`)}
              on:keydown={(e) =>
                e.key === "Enter" && goto(`/users/ad/achievements/update/${achievement.id}`)}
              role="button"
              tabindex="0"
        >
            {#if achievement.badge_logo}
              <div class="avatar flex justify-center">
                <div class="w-24 rounded-full">
                  <img src={achievement.badge_logo} alt="error"/>
                </div>
              </div>
            {:else}
              <Trophy />
            {/if}
            <p class="text-gray-700 font-bold leading-relaxed">
                    {achievement.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {achievement.description}
            </p>
        </div>
    {/each}
    <button 
      type="button" 
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      on:click={() => goto('/users/ad')}
    >
      Back
    </button>
    <button 
        type="button" 
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        on:click={handleCreateAchievements}
      >
        Create Achievements
    </button>
</div>