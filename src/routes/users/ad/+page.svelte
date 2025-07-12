<script>
  import { goto } from "$app/navigation";
  import { Award, Gift, Tags, Users, BarChart3, Settings, Shield, Database } from "lucide-svelte";
  
  export let data;
  
  const adminFeatures = [
    {
      title: "Achievements",
      description: "Create and manage user achievements",
      icon: Award,
      href: "/users/ad/achievements",
      color: "bg-yellow-500"
    },
    {
      title: "Rewards",
      description: "Set up and manage reward systems",
      icon: Gift,
      href: "/users/ad/rewards",
      color: "bg-red-500"
    },
    {
      title: "Task Categories",
      description: "Organize and manage task categories",
      icon: Tags,
      href: "/users/ad/task-categories",
      color: "bg-indigo-500"
    }
  ];
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
    <p class="mt-2 text-gray-600">Manage system settings and user experiences</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Users class="h-8 w-8 text-blue-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Total Users</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Award class="h-8 w-8 text-yellow-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Achievements</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Gift class="h-8 w-8 text-red-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Rewards</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Tags class="h-8 w-8 text-indigo-500" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Categories</p>
          <p class="text-2xl font-semibold text-gray-900">-</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Feature Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each adminFeatures as feature}
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
            Manage {feature.title}
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
        on:click={() => goto("/users/ad/achievements/create")}
        class="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <Award class="h-4 w-4 mr-2" />
        New Achievement
      </button>
      <button
        on:click={() => goto("/users/ad/rewards/create")}
        class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <Gift class="h-4 w-4 mr-2" />
        New Reward
      </button>
      <button
        on:click={() => goto("/users/ad/task-categories/create")}
        class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <Tags class="h-4 w-4 mr-2" />
        New Category
      </button>
    </div>
  </div>

  <!-- System Overview -->
  <div class="mt-8 bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border rounded-lg p-4">
        <div class="flex items-center mb-2">
          <Shield class="h-5 w-5 text-gray-500 mr-2" />
          <h3 class="text-sm font-medium text-gray-900">Security Status</h3>
        </div>
        <p class="text-sm text-gray-600">All systems operational</p>
      </div>
      <div class="border rounded-lg p-4">
        <div class="flex items-center mb-2">
          <Database class="h-5 w-5 text-gray-500 mr-2" />
          <h3 class="text-sm font-medium text-gray-900">Database Health</h3>
        </div>
        <p class="text-sm text-gray-600">Running smoothly</p>
      </div>
    </div>
  </div>
</div>