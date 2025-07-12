<script>
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  export let data;

  let formData = {
    name: "",
    description: "",
    points_to_give: 0,
  };
  let isLoading = false;

  async function handleCreate() {
    isLoading = true;

    try {
      const { data: taskCategoriesData, error: taskCategoriesError } =
        await data.supabase
          .from("taskCategories")
          .insert({
            name: formData.name,
            description: formData.description,
            points_to_give: formData.points_to_give,
          })
          .select()
          .single();

      if (taskCategoriesError) {
        console.log("Error in inserting: ", taskCategoriesError);
        toast.error("Error inserting data");
      }
      console.log("Created data:", taskCategoriesData);
      toast.success("Task Category successfully created");
    } catch (error) {
      console.error("Error in inserting Task Category", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
<form on:submit={handleCreate}>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Task Categories</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="name" class="block text-sm/6 font-medium text-gray-900">Name</label>
          <div class="mt-2">
            <div>
                <input 
                    id="name"
                    type="text" 
                    bind:value={formData.name}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your task category name"
                    required
                />
            </div>
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm/6 font-medium text-gray-900">Description</label>
          <div class="mt-2">
            <textarea 
                name="description" 
                id="description" 
                rows="3" 
                bind:value={formData.description} 
                placeholder="Enter the description of the category..." 
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>

        <div class="col-span-full">
          <label for="about" class="block text-sm/6 font-medium text-gray-900">Points to Give</label>
          <div class="mt-2">
            <textarea 
                name="points_to_give" 
                id="points_to_give" 
                rows="3" 
                bind:value={formData.points_to_give} 
                placeholder="Enter points to give." 
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>



      </div>
    </div>
    
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto('/users/ad/task-categories')}
    >
        Cancel
    </button>

    <button 
        class="btn btn-primary" 
        type="submit"
        disabled={isLoading}
        on:click={() => handleCreate()}
    >
        {#if isLoading}
            Creating Account...
        {:else}
            Create Account
        {/if}
    </button>
  </div>
</form>
</div>
