<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { formatDate } from "$lib/helpers/formats";
    import { mockProjects } from "$lib/mockProjects";
    import { mockTeams } from "$lib/mockTeams";
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { onMount } from "svelte";

    export let data;

    let teamId;
    let currentTeam = [];
    let projects = [];
    let teamProjects = [];
    let activeProjects = [];
    let archivedProjects = [];
    let members = [];
    let roleData = {
        id: data.profile?.role_id,
        name: '',
    }

    // State for collapsible sections
    let showActiveProjects = true;
    let showArchivedProjects = false;

    async function fetchTeamByTeamId(teamid){
        const {data: teamsData, error: teamsError} = await data.supabase
            .from("teams")
            .select('*')
            .eq('id', teamid)
            .select()
            .single()
            ;
        
        if(teamsError){
            console.log("Team error: ", teamsError);
        }

        currentTeam = teamsData ?? [];
        console.log("Teams fetched: ", currentTeam);
    }

    async function fetchProjectsByTeamId(team_id){
        const {data: projectsData, error: projectsError} = await data.supabase
            .from('projects')
            .select('*')
            .eq('team_id', team_id)
            .select();
        
        if(projectsError){
            console.log("error: ", projectsError);
        }
        else{

            projects = projectsData ?? [];

            console.log("Projects fetched: ", projects);
            teamProjects = projects.filter(obj => obj.team_id == teamId);
            activeProjects = projects.filter(obj => !obj.is_archived);
            archivedProjects = projects.filter(obj => obj.is_archived);
            console.log("active projects: ", activeProjects);
            console.log("team projects: ", teamProjects);
            console.log("archived projects: ", archivedProjects);
        }
    }
    async function fetchTeamMembers(team_id){
        const {data: membersData, error: membersDataError} = await data.supabase
            .from("profiles")
            .select('*')
            .eq('team_id', team_id)
            .select();
        
        if(membersDataError){
            console.log("Member error: ", membersDataError);
        }

        members = membersData ?? [];
        console.log("membersData fetched: ", members);
    }

    const fetchRole = async (id) =>{
    if(id){
        const { data: rolesData, error: rolesDataError } = await data.supabase
            .from('roles')
            .select('*')
            .eq('id', id)
            .single();
        
            console.log("RolesDataFetched: ", rolesData)
        if(!rolesDataError){
            roleData.name = rolesData.name;
        }
        else{
            console.log("rolesDataFetchError: ", rolesDataError)
        }
        }
    }


    onMount(() => {
        teamId = $page.params.teamId;
        fetchProjectsByTeamId(teamId);
        fetchTeamByTeamId(teamId);
        fetchTeamMembers(teamId);
        if(data.profile?.role_id){
            fetchRole(data.profile?.role_id);
        }
    });

    const handleProjectClick = (projectId) => {
        goto(`/users/teams/project/${projectId}`);
    };

    const toggleActiveProjects = () => {
        showActiveProjects = !showActiveProjects;
    };

    const toggleArchivedProjects = () => {
        showArchivedProjects = !showArchivedProjects;
    };

    const goBack = () => {
        goto('/users/teams');
    };

    const handleCreateProject = () => {
        goto('/users/tl/create-projects');
    };
</script>

<svelte:head>
    <title>{currentTeam?.name || 'Team'} Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <button 
                on:click={goBack}
                class="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Teams
            </button>

                <div class="bg-white rounded-lg border p-4 mb-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                                <img 
                                    src={currentTeam.team_logo} 
                                    alt="{currentTeam.name} logo" 
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="ml-4">
                                <h1 class="text-2xl font-bold text-gray-900">{currentTeam.name}</h1>
                                <p class="text-gray-600">{currentTeam.description}</p>
                                <div class="flex items-center text-sm text-gray-500 mt-1">
                                    <span>{currentTeam.team_lead}</span>
                                    <span class="mx-2">•</span>
                                    <span>{members.length} members</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {#if roleData.name == 'team_leader'}
                                <button
                                    on:click={goto(`/users/tl/manage-members`)}
                                    class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Manage Members
                                </button>
                                <button
                                    on:click={goto(`/users/tl/update/${teamId}`)}
                                    class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Team
                                </button>
                            {/if}
                            <button
                                on:click={handleCreateProject}
                                class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-white rounded-lg border p-4 text-center">
                        <div class="text-2xl font-bold text-gray-900">{teamProjects.length}</div>
                        <div class="text-sm text-gray-500">Total Projects</div>
                    </div>
                    <div class="bg-white rounded-lg border p-4 text-center">
                        <div class="text-2xl font-bold text-svelte-primary">{activeProjects.length}</div>
                        <div class="text-sm text-gray-500">Active Projects</div>
                    </div>
                    <div class="bg-white rounded-lg border p-4 text-center">
                        <div class="text-2xl font-bold text-gray-600">{archivedProjects.length}</div>
                        <div class="text-sm text-gray-500">Archived Projects</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg border mb-4">
                    <button 
                        on:click={toggleActiveProjects}
                        class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div class="flex items-center">
                            <h2 class="text-lg font-semibold text-gray-900">Active Projects</h2>
                            <span class="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">{activeProjects.length}</span>
                        </div>
                        <svg 
                            class="w-5 h-5 text-gray-400 transform transition-transform {showActiveProjects ? 'rotate-180' : ''}"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {#if showActiveProjects}
                        <div class="p-4 border-t">
                                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {#each activeProjects as project}
                                        <div 
                                            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                            on:click={() => handleProjectClick(project.id)}
                                            on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                                            role="button"
                                            tabindex="0"
                                        >
                                            <div class="flex items-center mb-3">
                                                <div class="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0">
                                                    <img 
                                                        src={project.project_logo} 
                                                        alt="{project.name} logo" 
                                                        class="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div class="ml-3">
                                                    <h3 class="font-medium text-gray-900">{project.name}</h3>
                                                    <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                            <p class="text-sm text-gray-600 mb-2">{project.description}</p>
                                            <div class="text-xs text-gray-500">
                                                Created {formatDate(project.created_at)}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                        </div>
                    {/if}
                </div>

               
                <!-- Active Projects -->
                <!-- <div class="bg-white rounded-lg border mb-4">
                    <button 
                        on:click={toggleActiveProjects}
                        class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div class="flex items-center">
                            <h2 class="text-lg font-semibold text-gray-900">Active Projects</h2>
                            <span class="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">{activeProjects.length}</span>
                        </div>
                        <svg 
                            class="w-5 h-5 text-gray-400 transform transition-transform {showActiveProjects ? 'rotate-180' : ''}"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {#if showActiveProjects}
                        <div class="p-4 border-t">
                            {#if activeProjects.length > 0}
                                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {#each activeProjects as project}
                                        <div 
                                            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                            on:click={() => handleProjectClick(project.id)}
                                            on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                                            role="button"
                                            tabindex="0"
                                        >
                                            <div class="flex items-center mb-3">
                                                <div class="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0">
                                                    <img 
                                                        src={project.project_logo} 
                                                        alt="{project.name} logo" 
                                                        class="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div class="ml-3">
                                                    <h3 class="font-medium text-gray-900">{project.name}</h3>
                                                    <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                            <p class="text-sm text-gray-600 mb-2">{project.description}</p>
                                            <div class="text-xs text-gray-500">
                                                Created {formatDate(project.created_at)}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="text-center py-8">
                                    <div class="text-gray-400 mb-2">
                                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    </div>
                                    <p class="text-gray-500">No active projects</p>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div> -->

                <!-- Archived Projects -->
                {#if archivedProjects.length > 0}
                    <div class="bg-white rounded-lg border">
                        <button 
                            on:click={toggleArchivedProjects}
                            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div class="flex items-center">
                                <h2 class="text-lg font-semibold text-gray-900">Archived Projects</h2>
                                <span class="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">{archivedProjects.length}</span>
                            </div>
                            <svg 
                                class="w-5 h-5 text-gray-400 transform transition-transform {showArchivedProjects ? 'rotate-180' : ''}"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>

                        {#if showArchivedProjects}
                            <div class="p-4 border-t">
                                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {#each archivedProjects as project}
                                        <div 
                                            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer opacity-75"
                                            on:click={() => handleProjectClick(project.id)}
                                            on:keydown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                                            role="button"
                                            tabindex="0"
                                        >
                                            <div class="flex items-center mb-3">
                                                <div class="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0">
                                                    <img 
                                                        src={project.project_logo} 
                                                        alt="{project.name} logo" 
                                                        class="w-full h-full object-cover grayscale"
                                                    />
                                                </div>
                                                <div class="ml-3">
                                                    <h3 class="font-medium text-gray-900">{project.name}</h3>
                                                    <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                        Archived
                                                    </span>
                                                </div>
                                            </div>
                                            <p class="text-sm text-gray-600 mb-2">{project.description}</p>
                                            <div class="text-xs text-gray-500">
                                                Created {formatDate(project.created_at)}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}

                <!-- Empty State -->
                {#if teamProjects.length === 0}
                    <div class="bg-white rounded-lg border p-8 text-center">
                        <div class="text-gray-400 mb-4">
                            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                        <p class="text-gray-500 mb-4">This team doesn't have any projects yet.</p>
                        <button 
                            on:click={handleCreateProject}
                            class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                {/if}

        </div>
    </div>
</div> 