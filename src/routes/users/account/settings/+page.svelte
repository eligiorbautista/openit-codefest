<script lang="ts">
  import { User, Bell, Shield, Save, Lock, Settings } from 'lucide-svelte';
  import PasswordChangeModal from '$lib/components/modals/PasswordChangeModal.svelte';
  
  export let data;
  
  let showPasswordModal = false;
  
  // Use actual user data from session
  let userEmail = data.session?.user?.email || '';
  let userName = data.session?.user?.user_metadata?.full_name || data.session?.user?.email?.split('@')[0] || 'user';
  
  function openPasswordModal() {
    showPasswordModal = true;
  }
  
  function closePasswordModal() {
    showPasswordModal = false;
  }
  
  function handlePasswordSave(event) {
    // Handle password change logic here
    console.log('Password change submitted:', event.detail);
    // You can add your password change API call here
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Enhanced Settings Header -->
      <div class="mb-8 sm:mb-12">
        <div class="flex items-center gap-4 sm:gap-6">
          <div class="p-3 sm:p-4 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
            <Settings class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text">
              Settings
            </h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 font-medium">
              Manage your account preferences and privacy settings
            </p>
          </div>
        </div>
      </div>
      
      <div class="space-y-6 sm:space-y-8">
        <!-- Account Settings -->
        <div class="card bg-white shadow-xl sm:shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200">
          <div class="card-body p-4 sm:p-6 lg:p-8">
            <h2 class="card-title text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div class="p-1.5 sm:p-2 bg-svelte-100 rounded-lg sm:rounded-xl">
                <User class="w-5 h-5 sm:w-6 sm:h-6 text-svelte-primary" />
              </div>
              Account Settings
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div class="form-control space-y-2">
                <label class="label pb-2" for="username">
                  <span class="label-text text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Username</span>
                </label>
                <input 
                  id="username" 
                  type="text" 
                  value={userName} 
                  class="input input-md sm:input-lg bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-200 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400" 
                  placeholder="Enter your username"
                />
              </div>
              
              <div class="form-control space-y-2">
                <label class="label pb-2" for="email">
                  <span class="label-text text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Email Address</span>
                </label>
                <input 
                  id="email" 
                  type="email" 
                  value={userEmail} 
                  class="input input-md sm:input-lg bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-200 focus:-translate-y-1 transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400" 
                  placeholder="Enter your email"
                />
              </div>
              
              <div class="form-control md:col-span-2 space-y-2 mt-2 sm:mt-4">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 pb-2">
                  <label class="label pb-0" for="change-password-btn">
                    <span class="label-text text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Password</span>
                  </label>
                  <button 
                    id="change-password-btn"
                    type="button" 
                    class="btn btn-sm sm:btn-md lg:btn-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 rounded-lg sm:rounded-xl font-semibold justify-start shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
                    on:click={openPasswordModal}
                  >
                    <div class="p-1 bg-white rounded-md sm:rounded-lg shadow-sm">
                      <Lock class="w-3 h-3 sm:w-4 sm:h-4 text-svelte-primary" />
                    </div>
                    <span class="text-sm sm:text-base">Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notification Settings -->
        <div class="card bg-white shadow-xl sm:shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200">
          <div class="card-body p-4 sm:p-6 lg:p-8">
            <h2 class="card-title text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div class="p-1.5 sm:p-2 bg-svelte-100 rounded-lg sm:rounded-xl">
                <Bell class="w-5 h-5 sm:w-6 sm:h-6 text-svelte-primary" />
              </div>
              Notifications
            </h2>
            <div class="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              <div class="form-control bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <Bell class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="label-text text-sm sm:text-base font-semibold text-gray-800 block">Email notifications</span>
                      <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Receive notifications via email</p>
                    </div>
                  </div>
                  <div class="ml-4">
                    <input type="checkbox" checked class="toggle toggle-md sm:toggle-lg border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200" />
                  </div>
                </div>
              </div>
              
              <div class="form-control bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <Bell class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="label-text text-sm sm:text-base font-semibold text-gray-800 block">Push notifications</span>
                      <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <div class="ml-4">
                    <input type="checkbox" class="toggle toggle-md sm:toggle-lg border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200" />
                  </div>
                </div>
              </div>
              
              <div class="form-control bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <Bell class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="label-text text-sm sm:text-base font-semibold text-gray-800 block">SMS notifications</span>
                      <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Receive text messages for important updates</p>
                    </div>
                  </div>
                  <div class="ml-4">
                    <input type="checkbox" class="toggle toggle-md sm:toggle-lg border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Privacy Settings -->
        <div class="card bg-white shadow-xl sm:shadow-2xl border-0 rounded-xl sm:rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200">
          <div class="card-body p-4 sm:p-6 lg:p-8">
            <h2 class="card-title text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div class="p-1.5 sm:p-2 bg-svelte-100 rounded-lg sm:rounded-xl">
                <Shield class="w-5 h-5 sm:w-6 sm:h-6 text-svelte-primary" />
              </div>
              Privacy & Security
            </h2>
            <div class="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              <div class="form-control bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <User class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="label-text text-sm sm:text-base font-semibold text-gray-800 block">Make profile public</span>
                      <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Allow others to view your profile information</p>
                    </div>
                  </div>
                  <div class="ml-4">
                    <input type="checkbox" checked class="toggle toggle-md sm:toggle-lg border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200" />
                  </div>
                </div>
              </div>
              
              <div class="form-control bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm flex-shrink-0">
                      <Shield class="w-4 h-4 sm:w-5 sm:h-5 text-svelte-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="label-text text-sm sm:text-base font-semibold text-gray-800 block">Two-factor authentication</span>
                      <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div class="ml-4">
                    <input type="checkbox" class="toggle toggle-md sm:toggle-lg border-2 border-gray-300 checked:border-orange-500 checked:bg-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="flex justify-center sm:justify-end pt-2 sm:pt-4">
          <button class="btn btn-md sm:btn-lg bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-200 transform hover:scale-105 hover:-translate-y-1 font-semibold px-6 sm:px-8 w-full sm:w-auto">
            <Save class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            <span class="text-sm sm:text-base">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Password Change Modal -->
<PasswordChangeModal 
  show={showPasswordModal} 
  on:close={closePasswordModal}
  on:save={handlePasswordSave}
/>

 