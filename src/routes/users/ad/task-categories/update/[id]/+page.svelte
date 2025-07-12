<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  export let data;

  const task_category_id = $page.params.id;
  let taskCategoryDetails = {};
  let isLoading = false;
  let error = null;

  // Form fields
  let name = "";
  let description = "";
  let points_to_give = "";

  console.log(task_category_id);

  async function fetchTaskCategoryById() {
    try {
      isLoading = true;
      const { data: taskCategoryData, error: taskCategoryError } =
        await data.supabase
          .from("taskCategories")
          .select("*")
          .eq("id", task_category_id)
          .single();

      if (taskCategoryError) {
        console.log("error fetching task category: ", taskCategoryError);
        error = "Failed to fetch task category details";
        return;
      }

      taskCategoryDetails = taskCategoryData || {};
      // Populate form fields with existing data
      name = taskCategoryDetails.name || "";
      description = taskCategoryDetails.description || "";
      points_to_give = taskCategoryDetails.points_to_give || "";
      
      console.log("task category details: ", taskCategoryDetails);
    } catch (error) {
      console.log("Error fetching task category details: ", error);
      error = "Failed to fetch task category details";
    } finally {
      isLoading = false;
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    
    if (!name) {
      error = "Task category name is required";
      return;
    }

    try {
      isLoading = true;
      error = null;

      const { data: updatedData, error: updateError } = await data.supabase
        .from("taskCategories")
        .update({
          name: name,
          description: description,
          points_to_give: points_to_give
        })
        .eq("id", task_category_id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating task category:", updateError);
        error = "Failed to update task category";
        return;
      }

      console.log("Task category updated successfully:", updatedData);
      goto("/users/ad/task-categories");
    } catch (err) {
      console.error("Error updating task category:", err);
      error = "Failed to update task category";
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchTaskCategoryById();
  });
</script>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
  <form on:submit={handleUpdate}>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base/7 font-semibold text-gray-900">Update Task Category</h2>
        <p class="mt-1 text-sm/6 text-gray-600">
          Update the task category information below.
        </p>

        {#if error}
          <div class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        {/if}

        {#if isLoading}
          <div class="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Loading...
          </div>
        {/if}

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="name" class="block text-sm/6 font-medium text-gray-900"
              >Name</label
            >
            <div class="mt-2">
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  bind:value={name}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Enter your task category name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label for="description" class="block text-sm/6 font-medium text-gray-900"
              >Description</label
            >
            <div class="mt-2">
              <textarea
                name="description"
                id="description"
                rows="3"
                bind:value={description}
                placeholder="Enter the description of the category..."
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                disabled={isLoading}
              >
              </textarea>
            </div>
          </div>

          <div class="col-span-full">
            <label for="points_to_give" class="block text-sm/6 font-medium text-gray-900"
              >Points to Give</label
            >
            <div class="mt-2">
              <input
                name="points_to_give"
                id="points_to_give"
                type="number"
                bind:value={points_to_give}
                placeholder="Enter points to give"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        class="btn btn-secondary"
        type="button"
        on:click={() => goto("/users/ad/task-categories")}
        disabled={isLoading}
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Task Category"}
      </button>
    </div>
  </form>
</div>
