import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/auth/roles.js';

export async function load({ parent, url }) {
  const { supabase, session, profile } = await parent();

  if (!isAdmin(profile)) {
    const params = new URLSearchParams({
      reason: 'Access denied. Admin role required.',
      role: 'Admin'
    });
    throw redirect(302, `/unauthorized?${params.toString()}`);
  }

  return {
    supabase,
    session,
    profile
  };
}