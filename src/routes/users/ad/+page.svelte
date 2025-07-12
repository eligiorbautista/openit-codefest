<script>
    import { toast } from 'svelte-sonner';
    export let data;
    
    let achievements =  [];

    async function fetchAchievements(){
        const {data: achievementsData, error: achivementsError} = await data.supabase
            .from('achievements')
            .select('*')
        

        if(achivementsError){
            console.log("Error fetching achievements: ", achivementsError);
        }

        achievements = achievementsData ?? [];
        console.log("achievements: ", achievements);
    }
</script>


<div>

</div>