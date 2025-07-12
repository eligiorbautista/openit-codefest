<script>
    import { mockAchievements } from '$lib/mockAchievements';    
  import { Trophy } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';

    let achievements = mockAchievements;
</script>


<div>
    {#each achievements as achievement}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <Trophy />
            <p class="text-gray-700 font-bold leading-relaxed">
                    {achievement.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {achievement.description}
            </p>
        </div>
    {/each}
</div>