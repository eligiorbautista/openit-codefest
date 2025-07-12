<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { formatDate } from "$lib/helpers/formats";
    import { mockTeams } from "$lib/mockTeams";
    import { mockProjects } from "$lib/mockProjects";
    import { goto } from "$app/navigation";
  import { onMount } from "svelte";

    export let data;

    let teams = [];
    let teamId = data.profile.team_id;
    let userId = data?.session?.user.id;
    console.log(teamId);

  

    async function fetchTeamByTeamId(){
        const {data: teamsData, error: teamsError} = await data.supabase
            .from("teams")
            .select('*')
            .eq('id', teamId)
            .select();
        
        if(teamsError){
            console.log("Team error: ", teamsError);
        }

        teams = teamsData ?? [];
        console.log("Teams fetched: ", teams);
    }

    onMount(() => {
        fetchTeamByTeamId();
    })

    // Get projects count for each team
    const getProjectsCountForTeam = (teamId) => {
        return mockProjects.filter(project => project.team_id === teamId).length;
    };

    // Get active projects count for each team
    const getActiveProjectsCountForTeam = (teamId) => {
        return mockProjects.filter(project => project.team_id === teamId && !project.is_archived).length;
    };

    const handleTeamClick = (teamId) => {
        goto(`/users/teams/${teamId}`);
    };

    const handleCreateProject = () => {
        goto('/users/tl/create-projects');
    };

    

</script>

<svelte:head>
    <title>Teams - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Teams</h1>
                    <p class="text-gray-600">Browse and manage your teams</p>
                </div>
                <div class="flex gap-3">
                    <button
                        on:click={handleCreateProject}
                        class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors"
                    >
                        Create Project
                    </button>
                    <div class="bg-white rounded-lg px-3 py-2 border">
                        <span class="text-sm text-gray-500">Total: {teams.length}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teams Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each teams as team}
                <div 
                    class="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer p-4"
                    on:click={() => handleTeamClick(team.id)}
                    on:keydown={(e) => e.key === 'Enter' && handleTeamClick(team.id)}
                    role="button"
                    tabindex="0"
                >
                    <!-- Team Header -->
                    <div class="flex items-center mb-3">
                        <div class="w-12 h-12 rounded-lg overflow-hidden border flex-shrink-0">
                            <img 
                                src={team.team_logo} 
                                alt="{team.name} logo" 
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="ml-3">
                            <h3 class="font-semibold text-gray-900">{team.name}</h3>
                            <p class="text-sm text-gray-500">{team.team_lead}</p>
                        </div>
                    </div>

                    <!-- Team Description -->
                    <p class="text-sm text-gray-600 mb-3">{team.description}</p>

                    <!-- Team Stats -->
                    <div class="flex justify-between text-sm">
                        <div>
                            <span class="font-medium text-gray-900">{team.members_count}</span>
                            <span class="text-gray-500">members</span>
                        </div>
                        <div>
                            <span class="font-medium text-svelte-primary">{getProjectsCountForTeam(team.id)}</span>
                            <span class="text-gray-500">projects</span>
                        </div>
                        <div>
                            <span class="font-medium text-green-600">{getActiveProjectsCountForTeam(team.id)}</span>
                            <span class="text-gray-500">active</span>
                        </div>
                    </div>

                    <!-- Created Date -->
                    <div class="mt-3 pt-3 border-t text-xs text-gray-500">
                        Created {formatDate(team.created_at)}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Empty State -->
        {#if mockTeams.length === 0}
            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                <p class="text-gray-500 mb-4">Get started by creating your first team.</p>
                <button class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors">
                    Create Team
                </button>
            </div>
        {/if}
    </div>
</div>
