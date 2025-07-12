<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { mockProjectBoards } from "$lib/mockProjectBoards";
    import { mockProjectCards } from "$lib/mockProjectCards";
    import { mockProjects } from "$lib/mockProjects";
    import { mockTeams } from "$lib/mockTeams";
    import { formatDate } from "$lib/helpers/formats";
    import { page } from '$app/stores';
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

    export let data;

    let projectId;
    let teamId = data.profile?.team_id;
    let currentProject = [];
    let projectBoards = [];
    let projectCards = [];
    let isCreatingBoard = true;
    let isLoading = false;

    let formData = {
        name: '',
        description: '',
        project_id: ''
    }

    const boardButton = document.getElementById('board-button');

    function handleBoardButton()  {
        boardButton.addEventListener('click', () => {
            isCreatingBoard = !isCreatingBoard;
            console.log(isCreatingBoard);
        });
    }
   
    console.log(isCreatingBoard);

    async function fetchProjectDetails(){
        const {data: projectDetailsData, error: projectDetailsError} = await data.supabase
            .from('projects')
            .select('*')
            .eq('team_id', teamId)
            .select()
            .single();
        
        if(projectDetailsError){
            console.log('error fetching project details', projectDetailsError);
        }

        currentProject = projectDetailsData;

        console.log("Project Details Fetched: ", currentProject);
    }

    async function fetchProjectBoards(project_id){
        const {data: projectBoardsData, error: projectBoardsError} = await data.supabase
            .from('projectBoards')
            .select('*')
            .eq('project_id', project_id)
            .select();
        
        if(projectBoardsError){
            console.log("Error fetching boards: ", projectBoardsError);
        }

        projectBoards = projectBoardsData ?? [];
        console.log("Fetched boards: ", projectBoards);
    }

    async function createProjectBoard(){
        isLoading = true;
        try{
            const{data: createBoardData, error: createBoardError} = await data.supabase
            .from('projectBoards')
            .insert({
                name: formData.name,
                description:formData.description,
                project_id: projectId
            })
            .select()
            .single();

            if(createBoardError){
                console.log('Error creating board', createBoardError);
                toast.error('Error in creaing board');
            }
            toast.success('board created successfully');

            await fetchProjectBoards();
        }
        catch(error){
            console.log("Error creating data: ", error);
        }
        finally{
            isLoading = false;
        }
    }

    onMount(() => {
        projectId = $page.params.id;
        console.log("Project ID:", projectId);

        fetchProjectBoards(projectId);

        fetchProjectDetails();
        
        if (projectId) {
            currentProject = mockProjects.find(project => project.id == projectId);
            console.log("Current Project:", currentProject);
            
            if (currentProject) {
                projectBoards = mockProjectBoards.filter(board => board.project_id == projectId);
                projectCards = mockProjectCards.filter(card => card.project_id == projectId);
                console.log("Project Boards:", projectBoards);
                console.log("Project Cards:", projectCards);
            }
        }
    });

    const getCardsForBoard = (boardId) => {
        return projectCards.filter(card => card.project_board_id == boardId);
    };

    const goBack = () => {
            goto('/users/teams');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'todo': return 'bg-gray-100 text-gray-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'done': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
</script>

<svelte:head>
  <title
    >{currentProject?.name || "Project"} - Kanban Board - {PUBLIC_APP_NAME}</title
  >
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <button
            on:click={goBack}
            class="flex items-center text-gray-600 hover:text-gray-800 mr-6 transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to {"Team"}
          </button>

          {#if currentProject}
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
              >
                <img
                  src={currentProject.project_logo}
                  alt="{currentProject.name} logo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-4">
                <h1 class="text-2xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <p class="text-gray-600 text-sm">
                  {currentProject.description}
                </p>
              </div>
            </div>
          {/if}
        </div>

        <div class="flex items-center space-x-4">
          {#if currentProject}
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {currentProject.is_archived
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'}"
            >
              {currentProject.is_archived ? "Archived" : "Active"}
            </span>
          {/if}
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      {#if currentProject}
        <!-- Project Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="text-2xl font-bold text-gray-900">
              {projectBoards.length}
            </div>
            <div class="text-sm text-gray-500">Boards</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="text-2xl font-bold text-blue-600">
              {projectCards.length}
            </div>
            <div class="text-sm text-gray-500">Total Cards</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="text-2xl font-bold text-green-600">
              {projectCards.filter((card) => !card.is_archived).length}
            </div>
            <div class="text-sm text-gray-500">Active Cards</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm border">
            <div class="text-2xl font-bold text-orange-600">
              {projectCards.filter((card) => card.is_approved).length}
            </div>
            <div class="text-sm text-gray-500">Approved</div>
          </div>
        </div>

        <!-- Kanban Board -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Project Boards
          </h2>
          <button on:click={() => handleBoardButton} id="board-button"
            >Create Board</button
          >

          {#if projectBoards.length > 0}
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {#each projectBoards as board}
                <div class="bg-gray-50 rounded-lg p-4 min-h-[500px]">
                  <!-- Board Header -->
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                      {board.name}
                    </h3>
                    <span
                      class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {getCardsForBoard(board.id).length}
                    </span>
                  </div>

                  <p class="text-sm text-gray-600 mb-4">{board.description}</p>

                  <!-- Cards Container -->
                  <div class="space-y-3">
                    {#each getCardsForBoard(board.id) as card}
                      <div
                        class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <!-- Card Header -->
                        <div class="flex items-start justify-between mb-3">
                          <h4
                            class="text-sm font-semibold text-gray-900 flex-1"
                          >
                            {card.name}
                          </h4>
                          <div class="flex items-center space-x-1 ml-2">
                            {#if card.is_approved}
                              <span
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                Approved
                              </span>
                            {/if}
                            {#if card.is_archived}
                              <span
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                              >
                                Archived
                              </span>
                            {/if}
                          </div>
                        </div>

                        <!-- Card Description -->
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                          {card.description}
                        </p>

                        <!-- Card Footer -->
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <!-- Priority Badge -->
                            <span
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              Task #{card.id}
                            </span>
                          </div>

                          <!-- Avatar -->
                          <div
                            class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
                          >
                            <span class="text-xs font-medium text-gray-700">
                              {card.profile_id}
                            </span>
                          </div>
                        </div>
                      </div>
                    {/each}

                    <!-- Empty State for Board -->
                    {#if getCardsForBoard(board.id).length === 0}
                      <div class="text-center py-8">
                        <div
                          class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"
                        >
                          <svg
                            class="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <p class="text-sm text-gray-500 mb-3">No cards yet</p>
                        <button
                          class="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Add a card
                        </button>
                      </div>
                    {/if}

                    <!-- Add Card Button -->
                    <button
                      class="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-sm text-gray-600 font-medium transition-colors"
                    >
                      + Add a card
                    </button>
                  </div>
                </div>
                {#if isCreatingBoard}
                <form on:submit={createProjectBoard}>
                     <div class="bg-gray-50 rounded-lg p-4 min-h-[500px]">
                    <!-- Board Header -->
                    <div class="flex items-center justify-between mb-4">
                        <input 
                            id="name"
                            type="text" 
                            bind:value={formData.name}
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Enter board name"
                            required
                        />
                    </div>

                    <input 
                            id="description"
                            type="text" 
                            bind:value={formData.description}
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Enter board description"
                            required
                    />

                    <div class="space-y-3 pt-5">
                      <!-- Add Card Button -->
                      <button
                        type="submit"
                        class="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-sm text-gray-600 font-medium transition-colors"
                        disabled={isLoading}
                      >
                        
                        + Add Board
                      </button>
                    </div>
                  </div>
                </form>
                {/if}
              {/each}
            </div>
          {:else}
            <!-- Empty State for Project -->
            <div class="text-center py-12">
              <div
                class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No boards found
              </h3>
              <p class="text-gray-500 mb-6">
                This project doesn't have any boards yet.
              </p>
              <button
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Board
              </button>
            </div>
          {/if}
        </div>
      {:else}
        <!-- Project Not Found -->
        <div class="bg-white rounded-xl shadow-lg p-12 text-center">
          <div
            class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Project not found
          </h3>
          <p class="text-gray-500 mb-6">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <button
            on:click={goBack}
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
