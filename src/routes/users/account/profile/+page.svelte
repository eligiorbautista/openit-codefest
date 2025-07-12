<script>
  import { User, Phone, Calendar, MapPin, Edit, Shield, Settings, Camera, Share2 } from 'lucide-svelte';
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import ProfileModal from '$lib/components/modals/ProfileModal.svelte';
  import { goto } from '$app/navigation';
  
  export let data;
  
  let showPersonalModal = false;
  let showAddressModal = false;
  let showBioModal = false;
  let fileInput;
  
  // Use actual user data from session or provide defaults
  let userData = {
    username: data.profile?.username || 'default_user',
    name: data.session?.user?.user_metadata?.full_name || data.session?.user?.email || 'User',
    email: data.session?.user?.email || '',
    phone: data.session?.user?.user_metadata?.phone || 'Not provided',
    joinDate: data.session?.user?.created_at ? new Date(data.session.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently',
    address: {
      street: '123 Sa Kanto',
      city: 'Lucena City',
      state: 'Quezon Province',
      zipCode: '4301',
      country: 'Philippines'
    },
    bio: data.profile?.bio || 'Passionate software developer with expertise in modern web technologies. Enjoys building user-friendly applications and exploring new frameworks. When not coding, loves hiking and photography. Always eager to learn new technologies and contribute to meaningful projects that make a difference.',
    profilePicture: data.session?.user?.user_metadata?.avatar_url || 'https://via.placeholder.com/150'
  };

  
  // Form data
  let editData = { ...userData };
  
  function openPersonalModal() {
    editData = { ...userData };
    showPersonalModal = true;
  }
  
  function openAddressModal() {
    editData = { ...userData };
    showAddressModal = true;
  }
  
  function openBioModal() {
    editData = { ...userData };
    showBioModal = true;
  }
  
  function handleModalSave(event) {
    const data = event.detail;
    userData = { ...userData, ...data };
    closeModal();
  }
  
  function closeModal() {
    showPersonalModal = false;
    showAddressModal = false;
    showBioModal = false;
  }

  function openProfilePictureUpload() {
    fileInput.click();
  }

  function handleProfilePictureChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        userData.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function shareProfile() {
    const profileUrl = `${window.location.origin}/profile/${encodeURIComponent(userData.email)}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${userData.name}'s Profile - ${PUBLIC_APP_NAME}`,
        text: `Check out ${userData.name}'s profile on ${PUBLIC_APP_NAME}`,
        url: profileUrl
      });
    } else {
      navigator.clipboard.writeText(profileUrl).then(() => {
        alert('Profile URL copied to clipboard!');
      });
    }
  }
</script>

<svelte:head>
  <title>Profile - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-svelte-50 to-svelte-100">
  <div class="container mx-auto px-4 py-16 max-w-6xl">
    <div class="mb-16">
      <div class="flex items-center gap-4 sm:gap-6 justify-center">
        <div class="p-3 sm:p-4 bg-gradient-to-br from-svelte-primary to-svelte-secondary rounded-2xl shadow-lg">
          <User class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div class="text-center sm:text-left">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text">
            Your Profile
          </h1>
          <p class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 font-medium">
            Manage your personal information and account settings.
          </p>
        </div>
      </div>
    </div>
    
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div class="text-center">
            <div class="mb-6">
              <div class="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-svelte-100 mx-auto group">
                <img src={userData.profilePicture} alt="Profile" class="w-full h-full object-cover" />
                
                <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                     on:click={openProfilePictureUpload}
                     on:keydown={(e) => e.key === 'Enter' && openProfilePictureUpload()}
                     role="button"
                     tabindex="0">
                  <Camera class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">Click to change photo</p>
            </div>
            
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{userData.name}</h2>
            <p class="text-gray-600 mb-6">Software Developer</p>
            
            <div class="space-y-3">
              <button 
                on:click={shareProfile}
                class="w-full bg-gradient-to-r from-svelte-primary to-svelte-secondary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Share2 class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="text-sm sm:text-base">Share Profile</span>
              </button>
              
              <button class="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-svelte-primary rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 font-semibold flex items-center justify-center gap-2">
                <Settings class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="text-sm sm:text-base">Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Account Status</span>
              <div class="flex items-center gap-2">
                <Shield class="w-4 h-4 text-green-500" />
                <span class="text-green-600 font-medium">Verified</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member Since</span>
              <span class="font-medium text-gray-800">July 2025</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Profile Views</span>
              <span class="font-medium text-gray-800">127</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-800">Personal Information</h3>
            <button 
              on:click={openPersonalModal}
              class="p-2 text-gray-400 hover:text-svelte-primary hover:bg-svelte-50 rounded-lg transition-all duration-200"
            >
              <Edit class="w-5 h-5" />
            </button>
          </div>
          
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6">

            <div class="space-y-2">
              <span class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Username</span>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
                <User class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{userData.username}</span>
              </div>
            </div>
            <div class="space-y-2">
              <span class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Full Name</span>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
                <User class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{userData.name}</span>
              </div>
            </div>
            
            <div class="space-y-2">
              <span class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone</span>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
                <Phone class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{userData.phone}</span>
              </div>
            </div>
            
            <div class="space-y-2 sm:col-span-2">
              <span class="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Join Date</span>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
                <Calendar class="w-5 h-5 text-svelte-primary flex-shrink-0" />
                <span class="text-gray-800 font-medium">{userData.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-800">Address</h3>
            <button 
              on:click={openAddressModal}
              class="p-2 text-gray-400 hover:text-svelte-primary hover:bg-svelte-50 rounded-lg transition-all duration-200"
            >
              <Edit class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex items-start gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <MapPin class="w-6 h-6 text-svelte-primary flex-shrink-0 mt-1" />
            <div>
              <div class="text-gray-800 font-medium mb-1">{userData.address.street}</div>
              <div class="text-gray-600">{userData.address.city}, {userData.address.state} {userData.address.zipCode}</div>
              <div class="text-gray-600">{userData.address.country}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-800">About Me</h3>
            <button 
              on:click={openBioModal}
              class="p-2 text-gray-400 hover:text-svelte-primary hover:bg-svelte-50 rounded-lg transition-all duration-200"
            >
              <Edit class="w-5 h-5" />
            </button>
          </div>
          
          <div class="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-svelte-primary hover:bg-white transition-all duration-200">
            <p class="text-gray-700 leading-relaxed">
              {userData.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<input 
  type="file" 
  accept="image/*" 
  bind:this={fileInput}
  on:change={handleProfilePictureChange}
  class="hidden"
  aria-label="Select profile picture"
/>

<ProfileModal 
  show={showPersonalModal} 
  type="personal" 
  data={editData} 
  on:save={handleModalSave} 
  on:close={closeModal} 
/>

<ProfileModal 
  show={showAddressModal} 
  type="address" 
  data={editData} 
  on:save={handleModalSave} 
  on:close={closeModal} 
/>

<ProfileModal 
  show={showBioModal} 
  type="bio" 
  data={editData} 
  on:save={handleModalSave} 
  on:close={closeModal} 
/>