<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { formatDate } from "$lib/helpers/formats";
    import { mockProjects } from  "$lib/mockProjects";
    import { goto } from "$app/navigation"; 
    import { onMount } from "svelte";
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    
    let id;
    // Team ID should be fetched along with team name
    const sampleTeamName = "Sample Name"
    const team_id = "teamID"
    $: projectData = {
        name: '',
        description: '',
        team_id: team_id,
        is_archived: false, // False by default
        project_logo: '',
    };

    onMount(() => {
    const $page = get(page);
    id = $page.params.id;
    console.log("Edit Project Page Mounted:", id);
    if (id) {
        // Fetch project data here
        let result = mockProjects.filter(obj => obj.id == id);
        console.log("Result:", result[0])
        projectData.name = result[0].name;
        projectData.description = result[0].description;
        projectData.is_archived = result[0].is_archived;
        projectData.project_logo = result[0].project_logo;
    }
    });
</script>

<svelte:head>
    <title>Create Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
<form>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="project-name" class="block text-sm/6 font-medium text-gray-900">Project Name</label>
          <div class="mt-2">
            <div>
                <input 
                    id="project-name"
                    type="text" 
                    bind:value={projectData.name}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your Project Name"
                    required
                />
            </div>
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm/6 font-medium text-gray-900">Description</label>
          <div class="mt-2">
            <textarea name="about" 
              id="about"
              rows="3" 
              placeholder="Enter the description of your project..." 
              bind:value={projectData.description}
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>


      </div>
    </div>

    <!-- Logo File -->
    <div>
        {#if projectData.project_logo}
          <div class="avatar flex justify-center">
            <div class="w-24 rounded-full">
              <img src={projectData.project_logo} alt="error"/>
            </div>
          </div>
        {/if}
        <label class="block font-semibold mb-1 text-gray-700" for="video-thumbnail">Edit Project Logo</label>
        <input 
            id="video-thumbnail" 
            class="file-input file-input-bordered w-full bg-white text-gray-900" 
            type="file" 
            accept="image/*" 
            required 
        />
    </div>
    
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto('/users/teams')}
    >
        Cancel
    </button>

    <button 
        class="btn btn-primary" 
        type="submit"
    >
        Create
    </button>
  </div>
</form>


</div>