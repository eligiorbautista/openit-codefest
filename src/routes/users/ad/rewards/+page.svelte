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
    

    function editReward(reward_id){
        goto(`/users/ad/rewards/update/${reward_id}`);
    }

    onMount(() => {
        fetchRewards();
    })
</script>

<div>
    <h1>Rewards</h1>

    <button
        on:click={() => goto('/users/ad/rewards/create')}
    >create reward</button>
    {#each rewards as reward}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <Trophy />
            <p class="text-gray-700 font-bold leading-relaxed">
                    {reward.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {reward.description}
            </p>
               <p class="text-gray-700 leading-relaxed">
                    {reward.points_requirement}
            </p>

            <button
                on:click={() => editReward(reward.id)}
                class="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                Edit
            </button>

            <button
                on:click={() => deleteReward(reward.id)}
                class="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Delete
            </button>
        </div>
    {/each}
</div>