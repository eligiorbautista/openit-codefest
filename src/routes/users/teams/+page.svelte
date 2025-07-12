<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { formatDate } from "$lib/helpers/formats";
    import { mockProjects } from  "$lib/mockProjects";
    import { goto } from "$app/navigation"; 
    
    const sampleTeamName = "Sample Name"


    // State component of collapse
    let onArchivedProjects = true;
    let onActiveProjects = true;

    const toggleOnArchivedProjects = async () =>{
        onArchivedProjects = !onArchivedProjects;
    }

    const toggleOnActiveProjects = async () =>{
        onActiveProjects = !onActiveProjects;
    }
</script>

<svelte:head>
    <title>Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div>
    <div>
        Team {sampleTeamName}
    </div>
    <div>
        <h1>
            Projects
        </h1>
        <button onclick={toggleOnActiveProjects} class="hs-collapse-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" id="hs-basic-collapse" aria-expanded="false" aria-controls="hs-basic-collapse-heading" data-hs-collapse="#hs-basic-collapse-heading">
            Active Projects
            <svg class="hs-collapse-open:rotate-180 shrink-0 size-4 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"></path>
            </svg>
        </button>
        <div>
            {#if onActiveProjects}
                <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-3 gap-8 mt-4">
                    {#each mockProjects as project}
                        {#if project.is_archived}
                            <div class="card lg:card-side bg-base-100 shadow-sm">
                                <figure>
                                    <img
                                    src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                                    alt="Album" />
                                </figure>
                                <div class="card-body">
                                    <h2 class="card-title">{project.name}</h2>
                                    <h4>{formatDate(project.created_at)}</h4>
                                    <p>{project.description}</p>
                                    <div class="card-actions justify-end">
                                        <button class="btn btn-primary" onclick={()=> goto(`/users/teams/project/${project.id}`)}>View</button>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
        <button onclick={toggleOnArchivedProjects} class="hs-collapse-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" id="hs-basic-collapse" aria-expanded="false" aria-controls="hs-basic-collapse-heading" data-hs-collapse="#hs-basic-collapse-heading">
            Archived Projects
            <svg class="hs-collapse-open:rotate-180 shrink-0 size-4 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"></path>
            </svg>
        </button>
        <div>
            {#if onArchivedProjects}
                <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-3 gap-8 mt-4">
                    {#each mockProjects as project}
                        {#if !project.is_archived}
                            <div class="card lg:card-side bg-base-100 shadow-sm">
                                <figure>
                                    <img
                                    src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                                    alt="Album" />
                                </figure>
                                <div class="card-body">
                                    <h2 class="card-title">New album is released!</h2>
                                    <p>Click the button to listen on Spotiwhy app.</p>
                                    <div class="card-actions justify-end">
                                        <button class="btn btn-primary" onclick={()=> goto(`/users/teams/project/${project.id}`)} >View</button>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
