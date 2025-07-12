<script>
  import { PUBLIC_APP_NAME } from "$env/static/public";
  import { formatDate } from "$lib/helpers/formats";
  import { mockProjects } from "$lib/mockProjects";
  import { goto } from "$app/navigation";
  import { createClient } from "@supabase/supabase-js";
  import { toast } from "svelte-sonner";

  export let data;
  const { session, supabase } = data;

  const sampleTeamName = "Sample Name";
  const team_id = data.profile?.team_id;


  let isSubmitting = false;
  let errorMessage = "";
  let selectedFile = null;

  $: projectData = {
    name: "",
    description: "",
    team_id: team_id,
    is_archived: false, // False by default
    project_logo: "",
  };

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;
      projectData.project_logo = file.name;
    }
  }

  async function uploadLogo(file) {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from("projects-logos")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload project logo: ${error.message}`);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("projects-logos")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    isSubmitting = true;
    errorMessage = "";

    try {
      if (!projectData.name.trim()) {
        toast.error("Project name is required");
        throw new Error("Project name is required");
      }

      if (!projectData.description.trim()) {
        toast.error("Project description is required");
        throw new Error("Project description is required");
      }

      if (!selectedFile) {
        toast.error("Project logo is required");
        throw new Error("Project logo is required");
      }

      const logoUrl = await uploadLogo(selectedFile);
      if (!logoUrl) {
        toast.error("Failed to upload project logo");
        throw new Error("Failed to upload project logo");
      }

      const projectToCreate = {
        name: projectData.name.trim(),
        description: projectData.description.trim(),
        team_id: projectData.team_id,
        is_archived: projectData.is_archived,
        project_logo: logoUrl,
      };

      console.log(
        "Creating project with data:",
        JSON.stringify(projectToCreate, null, 2)
      );

      // Insert into projects table
      const { data, error } = await supabase
        .from("projects")
        .insert([projectToCreate])
        .select();

      if (error) {
        toast.error(`Failed to create project: ${error.message}`);
        console.error("Error creating project:", error);
        throw error;
      }
      toast.success("Project created successfully!");
      console.log("Project created successfully:", data);
      goto("/users/teams");
    } catch (error) {
      toasts.error(`Error: ${error.message}`);
      console.error("Error creating project:", error);
      errorMessage =
        error.message || "An error occurred while creating the project";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Create Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
  <form on:submit={handleSubmit}>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base/7 font-semibold text-gray-900">
          Create New Project
        </h2>
        <p class="mt-1 text-sm/6 text-gray-600">
          This information will be displayed publicly so be careful what you
          share.
        </p>

        {#if errorMessage}
          <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{errorMessage}</p>
          </div>
        {/if}

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label
              for="project-name"
              class="block text-sm/6 font-medium text-gray-900"
              >Project Name</label
            >
            <div class="mt-2">
              <div>
                <input
                  id="project-name"
                  type="text"
                  bind:value={projectData.name}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Enter your Project Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="block text-sm/6 font-medium text-gray-900"
              >Description</label
            >
            <div class="mt-2">
              <textarea
                name="about"
                id="about"
                rows="3"
                bind:value={projectData.description}
                placeholder="Enter the description of your project..."
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo File -->
      <div>
        <label
          class="block font-semibold mb-1 text-gray-700"
          for="video-thumbnail">Upload Project Logo</label
        >
        <input
          id="video-thumbnail"
          class="file-input file-input-bordered w-full bg-white text-gray-900"
          type="file"
          accept="image/*"
          on:change={handleFileSelect}
          required
          disabled={isSubmitting}
        />
        {#if selectedFile}
          <p class="text-sm text-gray-600 mt-1">
            Selected: {selectedFile.name} ({(
              selectedFile.size /
              1024 /
              1024
            ).toFixed(2)} MB)
          </p>
        {/if}
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        class="btn btn-secondary"
        type="button"
        on:click={() => goto("/users/teams")}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button class="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </div>
  </form>
</div>
