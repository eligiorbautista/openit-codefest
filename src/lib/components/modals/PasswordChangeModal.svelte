<script>
  import { X, Lock } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let show = false;

  const dispatch = createEventDispatcher();

  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';

  function closeModal() { 
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    dispatch('close');
  }

  function handleSubmit() { 
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const passwordData = {
      currentPassword,
      newPassword,
      confirmPassword
    };

    dispatch('save', passwordData);
    closeModal();
  }

  function handleBackdropClick() {
    closeModal();
  }
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
    <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-svelte-100 rounded-xl">
              <Lock class="w-6 h-6 text-svelte-primary" />
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-800">Change Password</h3>
          </div>
          <button 
            on:click={closeModal}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="space-y-2">
            <label for="current-password" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Password</label>
            <input 
              id="current-password"
              type="password" 
              bind:value={currentPassword}
              class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
              placeholder="Enter current password"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="new-password" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">New Password</label>
            <input 
              id="new-password"
              type="password" 
              bind:value={newPassword}
              class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div class="space-y-2">
            <label for="confirm-password" class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Confirm Password</label>
            <input 
              id="confirm-password"
              type="password" 
              bind:value={confirmPassword}
              class="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-svelte-primary focus:bg-white focus:ring-4 focus:ring-svelte-primary/10 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
              placeholder="Confirm new password"
              required
            />
          </div>
          
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
              <Lock class="w-5 h-5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if} 