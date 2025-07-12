<script>
  import { X, Save, User, MapPin, FileText, Camera } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let show = false;
  export let data = {};

  const dispatch = createEventDispatcher();
 
  $: modalData = {
    last_name: data?.last_name || '',
    first_name: data?.first_name || '',
    phone: data?.phone || '',
    address: data?.address || '',
    bio: data?.bio || '',
    profilePicture: data?.profilePicture || ''
  };

  function closeModal() {
    dispatch('close');
  }

  function handleSubmit() {
    dispatch('save', modalData);
  }

  function handleBackdropClick() {
    closeModal();
  }

  $: modalTitle = {
    personal: 'Edit Personal Information',
    address: 'Edit Address', 
    bio: 'Edit About Me',
    picture: 'Edit Profile Picture'
  }[type];

  $: modalIcon = {
    personal: User,
    address: MapPin,
    bio: FileText,
    picture: Camera
  }[type];
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      on:click={handleBackdropClick}
      role="button"
      tabindex="-1"
      on:keydown
    ></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-svelte-100 rounded-xl">
              <svelte:component this={modalIcon} class="w-6 h-6 text-svelte-primary" />
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-800">{modalTitle}</h3>
          </div>
          <button 
            on:click={closeModal}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          {#if type === 'personal'}
            <div class="grid sm:grid-cols-2 gap-6">

                <div class="space-y-2">
                <label for="name-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                <input 
                  id="name-input"
                  type="text" 
                  bind:value={modalData.last_name}
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Enter your last name"
                  required
                />
              </div>


                <div class="space-y-2">
                <label for="name-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                <input 
                  id="name-input"
                  type="text" 
                  bind:value={modalData.first_name}
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              
              <div class="space-y-2">
                <label for="phone-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone</label>
                <input 
                  id="phone-input"
                  type="tel" 
                  bind:value={modalData.phone}
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          {:else if type === 'address'}
            <div class="space-y-6">
              <div class="space-y-2">
                <label for="street-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Street Address</label>
                <input 
                  id="street-input"
                  type="text" 
                  bind:value={modalData.address}
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Enter street address"
                  required
                />
              </div>
            </div>
          {:else if type === 'bio'}
            <div class="space-y-2">
              <label for="bio-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Bio</label>
              <textarea 
                id="bio-input"
                bind:value={modalData.bio}
                rows="6"
                class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400 resize-none"
                placeholder="Tell us about yourself..."
                required
              ></textarea>
            </div>
          {:else if type === 'picture'}
            <div class="space-y-6">
              <div class="text-center">
                <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-svelte-100 mx-auto mb-4">
                  <img src={modalData.profilePicture} alt="Profile preview" class="w-full h-full object-cover" />
                </div>
                <p class="text-gray-600 text-sm">Current profile picture</p>
              </div>
              
              <div class="space-y-2">
                <label for="picture-url-input" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile Picture URL</label>
                <input 
                  id="picture-url-input"
                  type="url" 
                  bind:value={modalData.profilePicture}
                  class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Enter image URL (https://...)"
                  required
                />
              </div>
              
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p class="text-blue-700 text-sm">
                  <strong>Tip:</strong> You can use any image URL from the web. Make sure it's a direct link to an image file (jpg, png, gif, etc.).
                </p>
              </div>
            </div>
          {/if}
          
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button"
              on:click={closeModal}
              class="px-6 py-3 sm:px-8 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-svelte-primary to-svelte-secondary hover:from-svelte-700 hover:to-svelte-600 text-white border-none rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <Save class="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if} 