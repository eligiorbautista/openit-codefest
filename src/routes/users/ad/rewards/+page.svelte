<script>
  import { goto } from '$app/navigation';
  import { Trophy } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
    
    export let data;

    let rewards = [];

    let loading  = false;


    async function fetchRewards(){
        const {data: rewardsData, error: rewardsError} = await data.supabase
            .from("rewards")
            .select('*')
        
        if(rewardsError){
            console.log("Error in fetching rewards: ", rewardsError);
        }

        rewards = rewardsData ?? [];
        console.log("Rewards: ", rewards);
    }

    async function  deleteReward(reward_id){
        const { error: deleteRewardError } = await data.supabase
            .from('rewards')
            .delete()
            .eq('id', reward_id);
        
        if(deleteRewardError){
            console.log("Error in delete: ", deleteRewardError);
            toast.error("Deleting failed");
        }
        else{
            toast.success("Reward deleted!");

            await fetchRewards();
        }
    }
    

    onMount(() => {
        fetchRewards();
    })
</script>

<div>
    <h1>Rewards</h1>
    {#each rewards as reward}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200"
              on:click={() => goto(`/users/ad/rewards/update/${reward.id}`)}
              on:keydown={(e) =>
                e.key === "Enter" && goto(`/users/ad/rewards/update/${reward.id}`)}
              role="button"
              tabindex="0"
        >
            {#if reward.reward_logo}
              <div class="avatar flex justify-center">
                <div class="w-24 rounded-full">
                  <img src={reward.reward_logo} alt="error"/>
                </div>
              </div>
            {:else}
              <Trophy />
            {/if}
            <p class="text-gray-700 font-bold leading-relaxed">
                    {reward.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {reward.description}
            </p>
               <p class="text-gray-700 leading-relaxed">
                    {reward.points_requirement}
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
        on:click={() => goto('/users/ad/rewards/create')}
      >
        Create Rewards
    </button>
</div>