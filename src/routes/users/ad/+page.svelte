<script>
    import { goto } from "$app/navigation";
</script>


<div class="p-5">
    home of admin
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto('/users/ad/achievements')}
    >
        Go to Achievements
    </button>
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto('/users/ad/rewards')}
    >
        Go to Rewards
    </button>
</div>