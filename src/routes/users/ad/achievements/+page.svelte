<script>
  import { Trophy } from '@lucide/svelte';
  import { supabase } from '@supabase/auth-ui-shared';
  import { User } from 'lucide-svelte';
  import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    export let data;
    
    let achievements =  [];
    let fileInput;
    let uploading =  false;
    let isLoading = false;
    let hasBadgeLogo = false;

    console.log(hasBadgeLogo);
    let formData = {
        name : achievements.name || '',
        description: achievements.description || '',
        badge_logo : '',
    }
    

    async function fetchAchievements(){
        const {data: achievementsData, error: achivementsError} = await data.supabase
            .from('achievements')
            .select('*')
        

        if(achivementsError){
            console.log("Error fetching achievements: ", achivementsError);
        }

        achievements = achievementsData ?? [];
        console.log("achievements: ", achievements);
    }

    function handleFileChange(event){
        const input = event.target.files[0];
        if(input){
            hasBadgeLogo = true;
        }
        console.log(input);
        console.log(hasBadgeLogo);
    }

    async function uploadAchievementLogo(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
        uploading = true;
        try {
            
            const userId = data.session.user.id;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            toast.info('Uploading profile picture...');

            const { data: uploadData, error: uploadError } = await data.supabase.storage
            .from('achivements-badges')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

            if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = data.supabase.storage
            .from('achivements-badges')
            .getPublicUrl(filePath);

            
            toast.success('Badge logo uploaded successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.error(`Upload failed: ${error.message}`);
        } finally {
            uploading = false;
        }
    }
  }

    async function upsertAchievement(event){
        event.preventDefault();

        isLoading = true;
        try{
            const {data: upsertAchievementsData , error: upsertAchievementsError} = await data.supabase
                .from('achievements')
                .upsert({
                    name: formData.name,
                    description: formData.description,
                    badge_logo: formData.badge_logo
                })
            
            if(upsertAchievementsError){
                toast.error("Failed to upsert achievement: ", upsertAchievementsError);
            }

            console.log("Acheivement successfully upserted", upsertAchievementsData);

            if(hasBadgeLogo){
                console.log("Uploading badge logo...");

                const uploadedImage = await uploadAchievementLogo();

                const {error: uploadingImageError} = await data.supabase
                    .from('achievements')
                    .upsert({badge_logo: uploadedImage})
                    .eq('id', upsertAchievementsData.id)

                if(uploadingImageError){
                    console.log("Error in uploading image to db: ", uploadingImageError);
                }

                toast.success("Achievement and image successfuly upserted");
            }
            else{
                toast.success("AChivement without image upserted");
            }

            toast.success("Achievement successfully upserted ");

            await fetchAchievements();
        }
        catch(error){
            console.error("Error in upserting achievements", error.message);
            toast.error("Failed to upsert achievement");
        }
        finally{
            isLoading = false;
        }
    }

    onMount(() => {
        fetchAchievements();

        console.log("Form Data: ",  formData);
    })
</script>


<div class="p-5">
    <h1 class="text-xl font-bold">ACHIEVEMENTS</h1>

    <form on:submit={upsertAchievement} class="space-y-4 sm:space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              for="name"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Name
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter achievement name"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="description"
              class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Description
            </label>

            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none"
              >
                <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
              </div>
              <input
                type="text"
                id="description"
                bind:value={formData.description}
                required
                class="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-svelte-primary focus:ring-2 focus:ring-svelte-primary/20 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your description"
              />
            </div>

            <div class="mb-4">
                <label for="images" class="block text-sm font-medium text-gray-700">
                    Badge logo
                </label>
                <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    on:change={handleFileChange}
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <p class="mt-1 text-xs text-gray-500">You can select multiple images at once (hold Ctrl/Cmd)</p>
            </div>
          </div>

        <button
          type="submit"
          disabled={isLoading}
          class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {#if isLoading}
            <div
              class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-sm sm:text-base">Creating achievement...</span>
          {:else}
            <span class="text-sm sm:text-base">Create Account</span>
          {/if}
        </button>
        </div>
    </form>


    {#each achievements as achievement}
        <div class="p-4 mb-5 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <Trophy />
            <p class="text-gray-700 font-bold leading-relaxed">
                    {achievement.name}
            </p>
            <p class="text-gray-700 leading-relaxed">
                    {achievement.description}
            </p>
        </div>
    {/each}
</div>