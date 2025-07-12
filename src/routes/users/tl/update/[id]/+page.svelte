
<script>
    import { Trophy } from '@lucide/svelte';
    import { supabase } from '@supabase/auth-ui-shared';
    import { User } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { toast } from 'svelte-sonner';
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import { formatDate } from "$lib/helpers/formats";
    
    export let data;
    
    let fileInput;
    let uploading =  false;
    let isLoading = false;
    let hasBadgeLogo = false;
    let selectedFile = null;

    // old logo path to delete
    let oldLogo = ''

    // ID from route
    let id;

    let formData = {
        name : '',
        description: '',
        team_logo : '',
        created_at : '',
    }
    

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                selectedFile = event.target?.result
                // console.log("Reader Result: ", selectedFile)
                // console.log("This ran")
            }
            formData.team_logo = file;
            hasBadgeLogo =true
        }
    }

    async function uploadTeamsLogo(id) {
        uploading = true;
        try {
            const team_id = id;
            const fileExt = formData.team_logo.name
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${team_id}/${fileName}`;

            // if has badge logo is true means its changing so delete the old file path
            // if (hasBadgeLogo){
            //     console.log("Trying to delete: ", oldLogo);
            //     const splitText = oldLogo.split("badges/")
            //     console.log("Split Text Restul:", splitText[1])
            //     const { data: deleteImage, error: deleteImageError } = await data.supabase.storage
            //         .from('achivement-badges')
            //         .remove([splitText[1]])
                    
            //     if (deleteImageError){
            //         console.log("Old Image was not deleted successfully", deleteImageError)
            //     }
            //     else{
            //         console.log("Old Image was deleted", deleteImage)
            //     }
            // }
                
            toast.info('Uploading Logo...');
            // Upload new image with old path
            const { data: uploadData, error: uploadError } = await data.supabase.storage
            .from('team-logos')
            .upload(filePath, formData.team_logo, {
                cacheControl: '3600',
                upsert: false
            });

            if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = data.supabase.storage
            .from('team-logos')
            .getPublicUrl(filePath);

            console.log("Created Logo Path: ", publicUrl)
            
            // Update Team with parameter id
            const { data: updateTeamData, error: updateTeamDataError } = await data.supabase
                .from('teams')
                .update({team_logo: publicUrl})
                .eq('id', id)
                .select()
                .single();
            
            console.log("Updating updateTeamData Logo URL: ", updateTeamData)

            if(updateTeamDataError){
                toast.error("Failed to upsert Team Data: ", updateTeamDataError);
                return;
            }

            toast.success('Badge logo uploaded successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            uploading = false;
        }
    }

    async function upsertTeam(event){
        event.preventDefault();

        isLoading = true;
        try{
            const {data: updateTeamsData , error: updateTeamsDataError} = await data.supabase
                .from('teams')
                .update({
                    name: formData.name,
                    description: formData.description,
                    team_logo: formData.team_logo,
                })
                .eq('id', id)
                .select()
                .single();
            
            if(updateTeamsDataError){
                toast.error("Failed to upsert Teams: ", updateTeamsDataError);
                return;
            }

            console.log("Teams successfully upserted", updateTeamsData);

            if(hasBadgeLogo){
                console.log("Uploading Team logo...");

                const uploadedImage = await uploadTeamsLogo(updateTeamsData.id);

                // const {error: uploadingImageError} = await data.supabase
                //     .from('achievements')
                //     .insert({badge_logo: uploadedImage})
                //     .eq('id', upsertAchievementsData.id)

                // if(uploadingImageError){
                //     console.log("Error in uploading image to db: ", uploadingImageError);
                // }

                toast.success("Teams and image successfuly upserted");
            }
            else{
                toast.success("Teams without image upserted");
            }

            toast.success("Teams successfully upserted ");
        }
        catch(error){
            console.error("Error in upserting Teams", error.message);
            toast.error("Failed to upsert Teams");
        }
        finally{
            isLoading = false;
        }
    }

    // Fetch current data from route params of id for specific data fecthing
    async function fetchTeam(id){
        const {data: TeamsData, error: TeamsDataError} = await data.supabase
            .from('teams')
            .select()
            .eq('id', id)
            .maybeSingle()
        

        if(TeamsDataError){
            console.log("Error fetching Teams: ", TeamsDataError);
        }

        // Store old logo for deletion when changing logo
        if(TeamsData.team_logo){
            oldLogo = TeamsData.team_logo;
        }
        formData.name = TeamsData.name;
        formData.description = TeamsData.description;
        formData.team_logo = TeamsData.team_logo;
        formData.created_at = TeamsData.created_at;
        console.log("Teams: ", formData);
    }

    onMount(() => {
        const $page = get(page);
        id = $page.params.id;

        if (id){
            fetchTeam(id);
        }
    })

</script>


<svelte:head>
    <title>Update Team - {PUBLIC_APP_NAME}</title>
</svelte:head>



<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
<form on:submit={upsertTeam}>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Update Your Team</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="team-name" class="block text-sm/6 font-medium text-gray-900">Team Name</label>
          <div class="mt-2">
            <div>
                <input 
                    id="team-name"
                    type="text" 
                    bind:value={formData.name}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your Team Name"
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
                placeholder="Enter the description of the Team..." 
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>


      </div>
    </div>

    <!-- Logo File -->
    <div>
        {#if formData.team_logo}
          <div class="avatar flex justify-center mb-4">
            <div class="w-24 rounded-full">
              <img src={hasBadgeLogo ? selectedFile : formData.team_logo} alt="error"/>
            </div>
          </div>
        {/if}
        <label
            class="block font-semibold mb-1 text-gray-700"
            for="badge-logo">Change Team Logo</label
        >
        <input
            id="badge-logo"
            class="file-input file-input-bordered w-full bg-white text-gray-900"
            type="file"
            accept="image/*"
            on:change={handleFileSelect}
            disabled={uploading}
        />
    </div>
    
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto(`/users/teams/${id}`)}
    >
        Cancel
    </button>

    <button 
        class="btn btn-primary" 
        type="submit"
    >
        Update
    </button>
  </div>
</form>


</div>