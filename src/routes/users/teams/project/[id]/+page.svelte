<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { mockProjectBoards } from  "$lib/mockProjectBoards";
    import { mockProjectCards } from "$lib/mockProjectCards";
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    import { get } from 'svelte/store';

    let id;
    let projectBoards;
    let projectCards;

    onMount(() => {
        const $page = get(page);
        id = $page.params.id;
        console.log("Edit Project Page Mounted:", id);
        if (id) {
            projectBoards = mockProjectBoards.filter(obj => obj.project_id == id);
            projectCards = mockProjectCards.filter(obj => obj.project_id == id);
            console.log("Project Boards", projectBoards);
            console.log("Project Cards", projectCards);
        }
    });


</script>

<svelte:head>
    <title>Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
    <div>
        <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-3 gap-8 mt-4">
            {#each projectBoards as boards}
                <div>
                    <h2>{boards.name}</h2>
                    <p>{boards.description}</p>
                    {#each projectCards as cards}
                        {#if cards.project_board_id == boards.id}
                            <div>
                                <h4>{cards.name}</h4>
                                <p>{cards.description}</p>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
        
    </div>
</div>

