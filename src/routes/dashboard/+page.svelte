<script>
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { mockTeams } from "$lib/mockTeams";
  import { mockProjects } from "$lib/mockProjects";
  import { mockProjectCards } from "$lib/mockProjectCards";
  import { formatDate } from "$lib/helpers/formats";

  export let data;
  let { supabase, session } = data;

  let isTeamLeader = true;
  let userTeams = [];
  let leaderTeams = [];

  let teams = [];
  let teamId = data.profile?.team_id;
  let userId = data?.session?.user.id;
  let projects = [];
  let teamProjects = [];
  let activeProjects = [];
  let archivedProjects = [];
  let members = [];

  

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

    onMount(() => {
        fetchTeamByTeamId();
        fetchProjectsByTeamId(teamId);
        fetchTeamMembers(teamId);
    })

</script>

<svelte:head>
  <title>Dashboard - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Welcome back{session
              ? `, ${session.user.email.split("@")[0]}`
              : ""}!
          </h1>
          <p class="text-gray-600">
            {#if isTeamLeader}
              Manage your teams and oversee project progress
            {:else}
              Here's what's happening with your projects
            {/if}
          </p>
          {#if isTeamLeader}
            <div class="mt-1">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-svelte-100 text-svelte-primary"
              >
                Team Leader
              </span>
            </div>
          {/if}
        </div>
        <div class="flex gap-3">
          {#if isTeamLeader}
            <button
              on:click={() => goto("/users/tl/create-projects")}
              class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors"
            >
              New Project
            </button>
          {:else}
            <button
              on:click={() => goto("/users/teams")}
              class="bg-svelte-primary text-white px-4 py-2 rounded-lg hover:bg-svelte-700 transition-colors"
            >
              Browse Teams
            </button>
            <button
              on:click={() => goto("/users/account/profile")}
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Profile
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {#if isTeamLeader}
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-gray-900">{projects.length}</div>
          <div class="text-sm text-gray-500">Total Projects</div>
        </div>
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-green-600">
            {members.length}
          </div>
          <div class="text-sm text-gray-500">Team Members</div>
        </div>
      {:else}
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-gray-900">{userTeams.length}</div>
          <div class="text-sm text-gray-500">My Teams</div>
        </div>
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-svelte-primary">
            {activeProjects}
          </div>
          <div class="text-sm text-gray-500">Active Projects</div>
        </div>
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-gray-900">{projects.length}</div>
          <div class="text-sm text-gray-500">My Tasks</div>
        </div>
        <div class="bg-white rounded-lg border p-4">
          <div class="text-2xl font-bold text-green-600">
            {Math.round((completedTasks / projects.length) * 100)}%
          </div>
          <div class="text-sm text-gray-500">Completed</div>
        </div>
      {/if}
    </div>

    <!-- Content Grid -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent Projects -->
      <div class="bg-white rounded-lg border p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            {#if isTeamLeader}
              Your Projects
            {:else}
              Recent Projects
            {/if}
          </h2>
          <button
            on:click={() => goto("/users/teams")}
            class="text-svelte-primary hover:text-svelte-700 text-sm font-medium"
          >
            View all →
          </button>
        </div>

        <div class="space-y-3">
          {#each projects as project}
            <div
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              on:click={() => goto(`/users/teams/project/${project.id}`)}
              on:keydown={(e) =>
                e.key === "Enter" && goto(`/users/teams/project/${project.id}`)}
              role="button"
              tabindex="0"
            >
              <div
                class="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0"
              >
                <img
                  src={project.project_logo}
                  alt="{project.name} logo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-3 flex-1">
                <h3 class="font-medium text-gray-900">{project.name}</h3>
                <p class="text-sm text-gray-500">{project.description}</p>
              </div>
              <div
                class="text-xs px-2 py-1 rounded-full {project.is_archived
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-600'}"
              >
                {project.is_archived ? "Archived" : "Active"}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg border p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="space-y-3">
          {#if isTeamLeader}
            <button
              on:click={() => goto("/users/tl/create-projects")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
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
              <div>
                <div class="font-medium text-gray-900">Create Project</div>
                <div class="text-sm text-gray-500">
                  Start a new team project
                </div>
              </div>
            </button>

            <button
              on:click={() => goto("/users/teams")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">Manage Teams</div>
                <div class="text-sm text-gray-500">
                  Oversee your teams and members
                </div>
              </div>
            </button>

            <button
              on:click={() => goto("/users/account/settings")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">Account Settings</div>
                <div class="text-sm text-gray-500">
                  Manage your account preferences
                </div>
              </div>
            </button>
          {:else}
            <button
              on:click={() => goto("/users/teams")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">Browse Teams</div>
                <div class="text-sm text-gray-500">
                  View all teams and projects
                </div>
              </div>
            </button>

            <button
              on:click={() => goto("/users/me")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">My Tasks</div>
                <div class="text-sm text-gray-500">
                  View assigned tasks and progress
                </div>
              </div>
            </button>

            <button
              on:click={() => goto("/users/account/profile")}
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <div
                class="w-10 h-10 bg-svelte-100 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-svelte-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">View Profile</div>
                <div class="text-sm text-gray-500">Manage your account</div>
              </div>
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        {#if isTeamLeader}
          Leadership Tools
        {:else}
          What you can do
        {/if}
      </h2>
      <div class="grid md:grid-cols-3 gap-4">
        {#if isTeamLeader}
          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Team Leadership</h3>
            <p class="text-sm text-gray-600">
              Lead teams and manage member assignments
            </p>
          </div>

          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Project Creation</h3>
            <p class="text-sm text-gray-600">
              Create and configure new projects
            </p>
          </div>

          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">
              Performance Analytics
            </h3>
            <p class="text-sm text-gray-600">
              Monitor team and project performance
            </p>
          </div>
        {:else}
          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Team Collaboration</h3>
            <p class="text-sm text-gray-600">
              Work with teammates on shared projects
            </p>
          </div>

          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Task Management</h3>
            <p class="text-sm text-gray-600">
              Track and complete assigned tasks
            </p>
          </div>

          <div class="bg-white rounded-lg border p-4 text-center">
            <div
              class="w-12 h-12 bg-svelte-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-svelte-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900 mb-2">Progress Tracking</h3>
            <p class="text-sm text-gray-600">
              Monitor your contributions and progress
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Get Started -->
    <div class="mt-8 bg-svelte-primary rounded-lg p-6 text-white text-center">
      <h2 class="text-xl font-semibold mb-2">
        {#if isTeamLeader}
          Ready to lead your team?
        {:else}
          Ready to collaborate?
        {/if}
      </h2>
      <p class="text-svelte-100 mb-4">
        {#if isTeamLeader}
          Create projects and manage your teams more effectively
        {:else}
          Join your team projects and start contributing
        {/if}
      </p>
      <div class="flex justify-center gap-3">
        {#if isTeamLeader}
          <button
            on:click={() => goto("/users/tl/create-projects")}
            class="bg-white text-svelte-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Create Project
          </button>
          <button
            on:click={() => goto("/users/teams")}
            class="bg-svelte-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-svelte-800 transition-colors"
          >
            Manage Teams
          </button>
        {:else}
          <button
            on:click={() => goto("/users/teams")}
            class="bg-white text-svelte-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Browse Teams
          </button>
          <button
            on:click={() => goto("/users/me")}
            class="bg-svelte-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-svelte-800 transition-colors"
          >
            View My Tasks
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
