<script>
  import { goto } from "$app/navigation";
  export let data;
  import { page } from "$app/stores";
  import { supabase } from "@supabase/auth-ui-shared";
  import { User } from "lucide-svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  const reward_id = $page.params.id;

  let rewardDetails = [];
  let isLoading = false;
  let uploading =  false;
  let hasBadgeLogo = false;
  let selectedFile = null;
  console.log(reward_id);

  let formData = {
    name: '',
    description: '',
    reward_logo: '',
    points_requirement : ''
  }


  onMount(() => {
    if(rewardDetails != []){
        formData.name = rewardDetails.name;
        formData.description = rewardDetails.description;
        formData.points_requirement = rewardDetails.points_requirement;
    }

    console.log(formData);
  })

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
        formData.reward_logo = file;
        hasBadgeLogo =true
    }
  }

  async function fetchRewardById() {
    try {
      const { data: rewardData, error: rewardError } = await data.supabase
        .from("rewards")
        .select("*")
        .eq("id", reward_id)
        .single();

      if (rewardError) {
        console.log("error fetching reward: ", rewardError);
        return;
      }

      formData.name = rewardData.name;
      formData.description = rewardData.description;
      formData.points_requirement = rewardData.points_requirement;
      formData.reward_logo = rewardData.reward_logo;

      console.log("reward details: ", formData);
    } catch (error) {
      console.log("Error fetching reward details: ", error);
    }
  }

  

  async function uploadRewardLogo(id) {
      uploading = true;
      try {
          const update_reward_id = id;
          const fileExt = formData.reward_logo.name
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${update_reward_id}/${fileName}`;

          toast.info('Uploading Reward logo...');

          const { data: uploadData, error: uploadError } = await data.supabase.storage
          .from('rewards-logos')
          .upload(filePath, formData.reward_logo, {
              cacheControl: '3600',
              upsert: false
          });

          if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = data.supabase.storage
          .from('rewards-logos')
          .getPublicUrl(filePath);

          console.log("Created Logo Path: ", publicUrl)
          
          // Update achievement with parameter id
          const { data: updateRewardsData, error: updateRewardsDataError } = await data.supabase
              .from('rewards')
              .update({reward_logo: publicUrl})
              .eq('id', id)
              .select()
              .single();
          
          console.log("Updating Rewards Logo URL: ", updateRewardsData)

          if(updateRewardsDataError){
              toast.error("Failed to upsert Rewards Logo: ", updateRewardsDataError);
              return;
          }

          toast.success('Rewards logo uploaded successfully!');
      } catch (error) {
          console.error('Error uploading Rewards:', error);
          toast.error(`Upload failed: ${error.message}`);
      } finally {
          uploading = false;
      }
  }

  async function upsertRewards() {
    uploading = true;

    try {
      const { data: upsertedRewardsData, error: upsertedRewardsError } = await data.supabase
          .from("rewards")
          .update({
              name: formData.name,
              description: formData.description,
              points_requirement: formData.points_requirement,
              reward_logo: formData.reward_logo,
          })
          .eq('id', reward_id)
          .select()
          .single();

      if (upsertedRewardsError) {
        console.log("Error in upserting: ", upsertedRewardsError);
        toast.error("Error upserting data");
        return;
      }

      if(hasBadgeLogo){
        console.log("Uploading badge logo...");

        const uploadedImage = await uploadRewardLogo(upsertedRewardsData.id);

        // const {error: uploadingImageError} = await data.supabase
        //     .from('achievements')
        //     .insert({badge_logo: uploadedImage})
        //     .eq('id', upsertAchievementsData.id)

        // if(uploadingImageError){
        //     console.log("Error in uploading image to db: ", uploadingImageError);
        // }

        toast.success("Reward Logo and image successfuly upserted");
      }
      else{
        toast.success("Achievement without image upserted");
      }

      console.log("Created data:" , upsertedRewardsData);
      toast.success("Reward successfully created");
    } catch (error) {
      console.error("Error in upserting reward", error);
    } finally {
      uploading = false;
    //   goto("/users/ad/rewards");
    }
  }

  onMount(() => {
    fetchRewardById();
  });
</script>


<div
  class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100 flex items-center justify-center px-4 py-8"
>
<form on:submit={upsertRewards}>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Rewards</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="reward-name" class="block text-sm/6 font-medium text-gray-900">Reward Name</label>
          <div class="mt-2">
            <div>
                <input 
                    id="reward-name"
                    type="text" 
                    bind:value={formData.name}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your reward Name"
                    required
                />
            </div>
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="points-requirement" class="block text-sm/6 font-medium text-gray-900">Points Requirement</label>
          <div class="mt-2">
            <div>
                <input 
                    id="points-requirement"
                    type="number" 
                    bind:value={formData.points_requirement}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Enter your reward points required"
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
                placeholder="Enter the description of the reward..." 
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </textarea>
          </div>
        </div>
        


      </div>
    </div>

    <!-- Logo File -->
    <div>
        {#if formData.reward_logo}
          <div class="avatar flex justify-center mb-4">
            <div class="w-24 rounded-full">
              <img src={hasBadgeLogo ? selectedFile : formData.reward_logo} alt="error"/>
            </div>
          </div>
        {/if}
        <label
            class="block font-semibold mb-1 text-gray-700"
            for="badge-logo">Upload Rewards Logo</label
        >
        <input
            id="badge-logo"
            class="file-input file-input-bordered w-full bg-white text-gray-900"
            type="file"
            accept="image/*"
            on:change={handleFileSelect}
            value=""
            disabled={uploading}
        />
    </div>
    
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button 
        class="btn btn-secondary" 
        type="button" 
        on:click={() => goto('/users/ad/rewards')}
    >
        Cancel
    </button>

    <button 
        class="btn btn-primary" 
        type="submit"
        disabled={uploading}
    >
        Update
    </button>
  </div>
</form>


</div>