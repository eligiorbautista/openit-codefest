<script>
    import { PUBLIC_APP_NAME } from "$env/static/public";
    import { formatDate } from "$lib/helpers/formats";
    import { mockMembers } from  "$lib/mockMembers";
    import { goto } from "$app/navigation"; 
    import { onMount } from "svelte";


    // Sample Team ID from mock data = 1

    // Fetch Team ID from session, from the user who is logged in
    // Fetch Members with Team ID
    export let data;

    // Store members here
    let members = []

    console.log("USER DATA: ", data);

    let sampleTeamName = '';


    async function fetchTeamMembers(team_id){
        const {data: membersData, error: membersDataError} = await data.supabase
            .from("profiles")
            .select('*')
            .eq('team_id', team_id)
            .select();
        
        if(membersDataError){
            console.log("Member error: ", membersDataError);
        }

        members = membersData ?? [];
        console.log("membersData fetched: ", members);
        paginate(members);
    }

    const fetchTeams = async (id) =>{
        if(id){
        const { data: teamsData, error: teamsDataError } = await data.supabase
            .from('teams')
            .select('*')
            .eq('id', id)
            .single();
        
            console.log("TeamsDataFetch: ", teamsData)
        if(!teamsDataError){
            sampleTeamName = teamsData.name;
        }
        else{
            console.log("TeamsDataFetchError: ", teamsDataError)
        }
        }
    }

    // Pagination by 7

    let rows = [];
    let page = 0;
    let totalPages = [];
    let currentPageRows = [];
    let itemsPerPage = 5;
    let loading = true;


    $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];


    onMount(() => {
    console.log("Team ID: ", data.profile?.team_id);
    if (data.profile?.team_id) {
        // Fetch project data here
        fetchTeamMembers(data.profile?.team_id)
        fetchTeams(data.profile?.team_id)
    }
    });

    // Paginate data
    const paginate = (items) => {
        const pages = Math.ceil(items.length / itemsPerPage);

        const paginatedItems = Array.from({ length: pages }, (_, index) => {
        const start = index * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
        });

        console.log("paginatedItems are", paginatedItems);
        totalPages = [...paginatedItems];
        currentPageRows = paginatedItems[page];
    };
    
    const setPage = (p) => {
        if (p >= 0 && p < totalPages.length) {
        page = p;
        }
    }
</script>

<svelte:head>
    <title>Projects - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="p-8">
    <div>
        <h1>Team {sampleTeamName}</h1>
    </div>
    <div>
        <h1>
            Members
        </h1>
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-white">
            <table class="table">
                <thead>
                    <tr class="text-base text-gray-900">
                        <th>Name</th>
                        <th>Address</th>
                        <th>Creation Date</th>
                    </tr>
                </thead>
                <tbody>
                    {#each currentPageRows as mem}
                        <tr class="hover:hover:bg-orange-300">
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="mask mask-squircle h-12 w-12">
                                            <img
                                            src={mem.profile_picture}
                                            alt="Avatar Tailwind CSS Component" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">{mem.first_name} {mem.last_name}</div>
                                        <div class="text-sm opacity-50">{mem.address}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {mem.address}
                            </td>
                            <td>
                                {formatDate(mem.created_at)}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="flex justify-center mt-4 mb-4 ">
                <button class="join-item btn mr-4" onclick={setPage(page - 1)}>Prev</button>
                <button class="join-item btn" onclick={setPage(page + 1)}>Next</button>
            </div>
        </div>
    </div>
</div>
