import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function load({ parent }) {
  const { supabase, session } = await parent();

  if (!session) {
    return { 
      supabase,
      session: null,
      profile: null 
    };
  }

  // Fetch profile with role information
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      role_id:roles(*)
    `)
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return { 
      supabase,
      session,
      profile: null 
    };
  }

  return { 
    supabase,
    session,
    profile 
  };
}