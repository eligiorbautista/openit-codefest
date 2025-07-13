<script>
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import { mockProjectBoards } from "$lib/mockProjectBoards";
  import { mockProjectCards } from "$lib/mockProjectCards";
  import { mockProjects } from "$lib/mockProjects";
  import { mockTeams } from "$lib/mockTeams";
  import { formatDate } from "$lib/helpers/formats";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  export let data;

    let projectId;
    let profileId = data.profile?.id;
    let teamId = data.profile?.team_id;
    let currentProject = [];
    let projectBoards = [];
    let projectCards = [];
    let isCreatingBoard = false;
    let isUpdatingBoard = false;
    let currentUpdatingBoardId = '';
    let isLoading = false;
  let projectId;
  let profileId = data.profile?.id;
  let teamId = data.profile?.team_id;
  let currentProject = [];
  let projectBoards = [];
  let taskCategories = [];
  let projectCards = [];
  let isCreatingBoard = false;
  let isCreatingCard = false;
  let creatingCardBoardId = '';
  let isLoading = false;

  let formData = {
    name: "",
    description: "",
    task_category_id: "",
  };

  const boardButton = document.getElementById("board-button");

  function handleBoardButton() {
    isCreatingBoard = !isCreatingBoard;
    console.log("IsCreating Board: ", isCreatingBoard);
  }

  function handleCardButton(board_id) {
    creatingCardBoardId = board_id;
    isCreatingCard = !isCreatingCard;
    console.log("Is creating card", isCreatingCard);
  }

  async function fetchTaskCategories() {
    const { data: taskCateogriesData, error: taskCategoriesError } =
      await data.supabase.from("taskCategories").select("*").select();

    if (taskCategoriesError) {
      console.log("error fetching task categories", taskCategoriesError);
    }

    taskCategories = taskCateogriesData;

    console.log("Task Categories Fetched: ", taskCategories);
  }

  async function fetchProjectDetails() {
    const { data: projectDetailsData, error: projectDetailsError } =
      await data.supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .select()
        .single();

    if (projectDetailsError) {
      console.log("error fetching project details", projectDetailsError);
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
        console.log("Fetched boards: ", projectBoardsData);
        projectBoardsData.sort((a, b) => a.created_at - b.created_at)
        projectBoards = projectBoardsData ?? [];
        console.log("Sorted boards: ", projectBoards);

    }
  async function fetchProjectBoards(project_id) {
    const { data: projectBoardsData, error: projectBoardsError } =
      await data.supabase
        .from("projectBoards")
        .select("*")
        .eq("project_id", project_id)
        .select();

    if (projectBoardsError) {
      console.log("Error fetching boards: ", projectBoardsError);
    }

    projectBoards = projectBoardsData ?? [];
    console.log("Fetched boards: ", projectBoards);
  }

  async function fetchProjectCards() {
    const { data: projectCardsData, error: projectCardsError } =
      await data.supabase.from("projectCards").select(`
                id,
                name,
                description,
                is_approved,
                is_archived,
                project_id, 
                taskCategories (
                    id,
                    name,
                    points_to_give
                ),
                projectBoards(
                    id,
                    name,
                    description
                )
            `);

    if (projectCardsError) {
      console.log("Error fetching boards: ", projectCardsError);
    }

    projectCards = projectCardsData ?? [];
    console.log("Fetched cards: ", projectCards);
  }

  async function createProjectBoard() {
    isLoading = true;
    try {
      const { data: createBoardData, error: createBoardError } =
        await data.supabase
          .from("projectBoards")
          .insert({
            name: formData.name,
            description: formData.description,
            project_id: projectId,
          })
          .select()
          .single();

      if (createBoardError) {
        console.log("Error creating board", createBoardError);
        toast.error("Error in creaing board");
      }
      toast.success("board created successfully");
      isCreatingBoard = false;
      await fetchProjectBoards(projectId);
    } catch (error) {
      console.log("Error creating data: ", error);
    } finally {
      isLoading = false;
    }
  }

  async function createProjectCard(board_id) {
    isLoading = true;

    const { data: createCardData, error: createCardError } = await data.supabase
      .from("projectCards")
      .insert(
        {
          name: formData.name,
          description: formData.description,
          project_id: projectId,
          project_board_id: board_id,
          task_Categories_id: formData.task_category_id,
          profile_id: profileId,
          updated_by: profileId,
        }
      )
      .select()
      .single();

    if (createCardError) {
      console.log(createCardError);
      toast.error("Error creating card");
    }

    toast.success("card created successfully");

    await fetchProjectCards();
  }

  async function approveCard(card_id, points) {
    const { data: approveCardData, error: approveCardError } =
      await data.supabase
        .from("projectCards")
        .update({
          is_approved: true,
        })
        .eq("id", card_id)
        .single();

    if (approveCardError) {
      console.log("error approving card: ", approveCardError);
    }
    toast.success("Task approved");

    const { data: addPointData, error: addPointError } = await data.supabase
      .from("profiles")
      .update({
        current_points: points,
      })
      .eq("id", profileId)
      .select()
      .single();

    if (addPointError) {
      console.log("Error adding points", addPointError);
    }
    console.log("Added points: ", points);
    toast.success("Points added yipee");
  }

  onMount(() => {
    projectId = $page.params.id;
    console.log("Project ID:", projectId);

    fetchTaskCategories();

    fetchProjectBoards(projectId);

    fetchProjectCards();

    fetchProjectDetails();

    // fetchProjectCards();
  });

    const getCardsForBoard = (boardId) => {
        console.log("Project Cards: ", projectCards);
        for (let x = 0; x < projectCards.length; x++){
            console.log(`Looop number ${x}: `, projectCards[x].projectBoards.id == boardId)
        }
        let result = projectCards.filter(obj => obj.projectBoards?.id == boardId);
        console.log("Get Cards for Boards Result: ", result);
        return result;
    };
  const getCardsForBoard = (boardId) => {
    console.log("Project Cards: ", projectCards);
    let result = projectCards.filter((obj) => obj.projectBoards?.id == boardId);
    console.log("Get Cards for Boards Result: ", result);
    return result;
  };

  const goBack = () => {
    goto("/users/teams");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

    const handleUpdateBoardButton = (id, name, description) => {
      isUpdatingBoard = !isUpdatingBoard;
      currentUpdatingBoardId = id
      updateData.name = name;
      updateData.description = description;
    }

    const updateData = {
      name: '',
      description: '',
    }

    const handleCancelUpdateButton = async () =>{
      isUpdatingBoard = false;
      currentUpdatingBoardId = '';
      updateData.name = '';
      updateData.description = '';
    }

    const submitUpdateBoardButton = async (id) =>{
      const {data: updateProjectBoards , error: updateProjectBoardsError} = await data.supabase
        .from('projectBoards')
        .update({
            name: updateData.name,
            description: updateData.description,
        })
        .eq('id', id)
        .select()
        .single();
      
      if(updateProjectBoardsError){
          toast.error("Failed to Update achievement: ", updateProjectBoards);
          return;
      }
      await fetchProjectBoards(projectId);
      console.log("Project Board successfully Updated", updateProjectBoards);

    }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <button
            class="btn btn-primary mb-4"
            on:click={handleBoardButton}
            id="board-button"
            >{!isCreatingBoard ? "Create Board" : "Cancel Creating"}</button
          >

          {#if projectBoards.length > 0}
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {#each projectBoards as board}
                <div class="bg-gray-50 rounded-lg p-4 min-h-[500px]">
                  <!-- Board Header -->
                  <div class="flex items-center justify-between mb-4">
                    {#if currentUpdatingBoardId == board.id}
                      <input 
                          id="name"
                          type="text" 
                          bind:value={updateData.name}
                          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          placeholder="Enter board name"
                          required
                      />
                    {:else}
                      <h3 class="text-lg font-semibold text-gray-900">
                        {board.name}
                      </h3>
                    {/if}
                    <!-- <span
                      class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {getCardsForBoard(board.id).length}
                    </span> -->
                    {#if isUpdatingBoard}
                      {#if currentUpdatingBoardId == board.id}
                        <button class="btn btn-primary mb-2" on:click={isUpdatingBoard ? submitUpdateBoardButton(board.id) : handleUpdateBoardButton(board.id)} id="board-button"
                          >{!isUpdatingBoard ? "Edit" : "Update"}</button
                        >
                        <button class="btn btn-warning mb-2" on:click={handleCancelUpdateButton} id="board-button"
                          >Cancel</button
                        >
                      {/if}
                    {:else}
                      <button class="btn btn-primary mb-4" on:click={handleUpdateBoardButton(board.id, board.name, board.description)} id="board-button"
                        >Edit</button
                      >
                    {/if}
                  </div>
                  
                  {#if currentUpdatingBoardId == board.id}
                      <input 
                          id="description"
                          type="text" 
                          bind:value={updateData.description}
                          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          placeholder="Enter Your Description Here..."
                          required
                      />
                  {:else}
                      <p class="text-sm text-gray-600 mb-4">{board.description}</p>
                  {/if}

                  <!-- Cards Container -->
                  <div class="space-y-3">
                    {#each projectCards as card}
                      {#if card.projectBoards.id == board.id}
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
                            <button
                              on:click={() =>
                                approveCard(
                                  card.id,
                                  card.taskCategories?.points_to_give
                                )}
                            >
                              Approve
                            </button>
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
                                Category {card.taskCategories?.name}
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
                      {/if}
                    {/each}
                    {#if isCreatingCard}
                      {#if creatingCardBoardId == board.id}
                       <form on:submit={createProjectCard(board.id)}>
                        <div
                          class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <!-- Card Header -->
                          <div class="flex items-start justify-between mb-3">
                            <input
                              id="name"
                              type="text"
                              bind:value={formData.name}
                              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              placeholder="Enter card name"
                              required
                            />
                          </div>

                          <!-- Card Description -->
                          <input
                              id="description"
                              type="text"
                              bind:value={formData.description}
                              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              placeholder="Enter card description"
                              required
                          />

                          <!-- Card Footer -->
                          <div class="flex items-center justify-between">
                            <div>
                              <label
                                class="block font-semibold mb-1 text-gray-700"
                                for="task-category">Task Category</label
                              >
                              <select
                                id="task-category"
                                class="select select-bordered w-full text-gray-900 bg-white"
                                bind:value={formData.task_category_id}
                                required
                              >
                                <option value="" disabled selected
                                  >Select category</option
                                >
                                {#each taskCategories.filter((c) => c.id !== 0) as cat}
                                  <option value={cat.id}>{cat.name}</option>
                                {/each}
                              </select>
                            </div>
                          </div>
                        </div>

                        <button 
                              class="btn btn-primary" 
                              type="submit"
                              disabled={isLoading}
                          >
                              Create
                          </button>
                      </form>
                      {/if}
                     
                    {/if}

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
                          on:click={handleCardButton}
                        >
                          Add a card
                        </button>
                      </div>
                    {/if}

                    <!-- Add Card Button -->
                    <button
                      class="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-sm text-gray-600 font-medium transition-colors"
                      on:click={() => handleCardButton(board.id)}
                    >
                      + Add a card
                    </button>
                  </div>
                </div>
              {/each}
              {#if isCreatingBoard}
                <form on:submit={createProjectBoard(board.id)}>
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
