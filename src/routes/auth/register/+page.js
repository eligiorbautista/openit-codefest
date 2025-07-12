import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function load({ parent }) {
  const { supabase, session } = await parent();

  if (!session) {
    return { roles: null };
  }

  const { data: roles, error } = await supabase
    .from('roles')
    .select('*')




  return { roles };
}