
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
    
    let achievements =  [];
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
        badge_logo : '',
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
            formData.badge_logo = file;
            hasBadgeLogo =true
        }
    }

    async function uploadAchievementLogo(id) {
        uploading = true;
        try {
            const achievement_id = id;
            const fileExt = formData.badge_logo.name
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${achievement_id}/${fileName}`;

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
            .from('achievements-badges')
            .upload(filePath, formData.badge_logo, {
                cacheControl: '3600',
                upsert: false
            });

            if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = data.supabase.storage
            .from('achievements-badges')
            .getPublicUrl(filePath);

            console.log("Created Logo Path: ", publicUrl)
            
            // Update achievement with parameter id
            const { data: updateAchievementData, error: updateAchievementsError } = await data.supabase
                .from('achievements')
                .update({badge_logo: publicUrl})
                .eq('id', id)
                .select()
                .single();
            
            console.log("Updating Achievements Logo URL: ", updateAchievementData)

            if(updateAchievementsError){
                toast.error("Failed to upsert achievement: ", updateAchievementsError);
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

    async function upsertAchievement(event){
        event.preventDefault();

        isLoading = true;
        try{
            const {data: updateAchievementsData , error: updateAchievementsError} = await data.supabase
                .from('achievements')
                .update({
                    name: formData.name,
                    description: formData.description,
                    badge_logo: formData.badge_logo,
                })
                .eq('id', id)
                .select()
                .single();
            
            if(updateAchievementsError){
                toast.error("Failed to upsert achievement: ", updateAchievementsError);
                return;
            }

            console.log("Acheivement successfully upserted", updateAchievementsData);

            if(hasBadgeLogo){
                console.log("Uploading badge logo...");

                const uploadedImage = await uploadAchievementLogo(updateAchievementsData.id);

                // const {error: uploadingImageError} = await data.supabase
                //     .from('achievements')
                //     .insert({badge_logo: uploadedImage})
                //     .eq('id', upsertAchievementsData.id)

                // if(uploadingImageError){
                //     console.log("Error in uploading image to db: ", uploadingImageError);
                // }

                toast.success("Achievement and image successfuly upserted");
            }
            else{
                toast.success("Achievement without image upserted");
            }

            toast.success("Achievement successfully upserted ");
        }
        catch(error){
            console.error("Error in upserting achievements", error.message);
            toast.error("Failed to upsert achievement");
        }
        finally{
            isLoading = false;
        }
    }

    // Fetch current data from route params of id for specific data fecthing
    async function fetchAchievements(id){
        const {data: achievementsData, error: achievementsError} = await data.supabase
            .from('achievements')
            .select()
            .eq('id', id)
            .maybeSingle()
        

        if(achievementsError){
            console.log("Error fetching achievements: ", achievementsError);
        }

        // Store old logo for deletion when changing logo
        if(achievementsData.badge_logo){
            oldLogo = achievementsData.badge_logo;
        }
        formData.name = achievementsData.name;
        formData.description = achievementsData.description;
        formData.badge_logo = achievementsData.badge_logo;
        formData.created_at = achievementsData.created_at;
        console.log("achievements: ", formData);
    }

    onMount(() => {
        const $page = get(page);
        id = $page.params.id;

        if (id){
            fetchAchievements(id);
        }
    })

</script>


<svelte:head>
    <title>Update Achievements - {PUBLIC_APP_NAME}</title>
</svelte:head>



<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
<form on:submit={upsertAchievement}>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Update The Selected Achievements</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="achievement-name" class="block text-sm/6 font-medium text-gray-900">Achievement Name</label>
          <div class="mt-2">
            <div>
                <input 
                    id="achievement-name"
                    type="text" 
                    bind:value={formData.name}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your achievement Name"
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
                placeholder="Enter the description of the achievement..." 
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>


      </div>
    </div>

    <!-- Logo File -->
    <div>
        {#if formData.badge_logo}
          <div class="avatar flex justify-center mb-4">
            <div class="w-24 rounded-full">
              <img src={hasBadgeLogo ? selectedFile : formData.badge_logo} alt="error"/>
            </div>
          </div>
        {/if}
        <label
            class="block font-semibold mb-1 text-gray-700"
            for="badge-logo">Change Achievement Logo</label
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
        on:click={() => goto('/users/ad/achievements')}
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