<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

    export let data;

    let taskCategories = [];
    let isLoading = false;

    async function fetchTaskCategories(){
        const {data: taskCategoriesData, error: taskCategoriesError} = await data.supabase
            .from("taskCategories")
            .select("*")
        
        if(taskCategoriesError){
            console.error("Error fetching task categories", taskCategoriesError);
        }

        taskCategories = taskCategoriesData || [];
        console.log("Task categories: ", taskCategories);
    }

    async function deleteTaskCategory(task_category_id){
        const { error: deleteError } = await data.supabase
            .from('taskCategories')
            .delete()
            .eq('id',task_category_id);
        
        if(deleteError){
            console.error("Delete error", deleteError);
        }

        toast.success("Category deleted successfully");

        await fetchTaskCategories();
    }

    onMount(() => {
        fetchTaskCategories();
    })
</script>



<div class="p-5">
    <h1 class="text-xl font-bold">TASK CATEGORIES</h1>

    {#each taskCategories as taskCategory}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <p class="text-gray-700 font-bold leading-relaxed">
                    {taskCategory.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {taskCategory.description}
            </p>
              <p class="text-gray-700 leading-relaxed">
                    {taskCategory.points_to_give}
            </p>

            <button
                on:click={() => goto(`/users/ad/task-categories/update/${taskCategory.id}`)}
                class="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Edit
            </button>
            <button
                on:click={() => deleteTaskCategory(taskCategory.id)}
                class="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Delete
            </button>
        </div>
    {/each}
    <button 
        type="button" 
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        on:click={() => goto('/users/ad/task-categories/create')}
      >
        Create Task Category
    </button>
</div>

