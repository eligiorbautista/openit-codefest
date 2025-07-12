import { redirect } from '@sveltejs/kit';
import { isTeamLeader, isAdmin } from '$lib/auth/roles.js';

export async function load({ parent, url }) {
  const { supabase, session, profile } = await parent();

  // Check if user is team leader or admin
  if (!isTeamLeader(profile) && !isAdmin(profile)) {
    const params = new URLSearchParams({
      reason: 'Access denied. Team Leader or Admin role required.',
      role: 'Team Leader or Admin'
    });
    throw redirect(302, `/unauthorized?${params.toString()}`);
  }

  return {
    supabase,
    session,
    profile
  };
} 