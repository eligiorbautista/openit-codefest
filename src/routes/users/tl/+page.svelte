<script>
  import { goto } from "$app/navigation";
  import { Users, FolderPlus, Settings, BarChart3, Calendar, Target } from "lucide-svelte";
  
  export let data;
  
  const teamLeaderFeatures = [
    {
      title: "Create Projects",
      description: "Set up new projects for your team",
      icon: FolderPlus,
      href: "/users/tl/create-projects",
      color: "bg-blue-500"
    },
    {
      title: "Manage Members",
      description: "View and manage your team members",
      icon: Users,
      href: "/users/tl/manage-members",
      color: "bg-green-500"
    },
    {
      title: "Update Projects",
      description: "Modify existing project details",
      icon: Settings,
      href: "/users/tl/update-projects",
      color: "bg-purple-500"
    }
  ];
</script>

<svelte:head>
  <title>Team Leader Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Team Leader Dashboard</h1>
    <p class="mt-2 text-gray-600">Manage your team and projects efficiently</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Users class="h-8 w-8 text-blue-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Team Members</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Target class="h-8 w-8 text-green-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Active Projects</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <BarChart3 class="h-8 w-8 text-purple-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Completed Tasks</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Feature Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each teamLeaderFeatures as feature}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 {feature.color} rounded-lg flex items-center justify-center">
                <svelte:component this={feature.icon} class="h-5 w-5 text-white" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{feature.title}</h3>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4">{feature.description}</p>
          <button
            on:click={() => goto(feature.href)}
            class="w-full bg-svelte-primary hover:bg-svelte-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Access {feature.title}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Quick Actions -->
  <div class="mt-8 bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
    <div class="flex flex-wrap gap-4">
      <button
        on:click={() => goto("/users/tl/create-projects")}
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <FolderPlus class="h-4 w-4 mr-2" />
        New Project
      </button>
      <button
        on:click={() => goto("/users/tl/manage-members")}
        class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <Users class="h-4 w-4 mr-2" />
        View Team
      </button>
      <button
        on:click={() => goto("/users/teams")}
        class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <BarChart3 class="h-4 w-4 mr-2" />
        Team Overview
      </button>
    </div>
  </div>
</div> 