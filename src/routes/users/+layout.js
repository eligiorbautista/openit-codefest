import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function load({ parent }) {
  const { supabase, session, profile } = await parent();

  // Profile data is now loaded in the root layout, so we just pass it through
  return { 
    supabase,
    session,
    profile 
  };
} 