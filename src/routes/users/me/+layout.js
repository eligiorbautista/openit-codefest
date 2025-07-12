import { redirect } from '@sveltejs/kit';
import { isMember, isTeamLeader, isAdmin } from '$lib/auth/roles.js';

export async function load({ parent, url }) {
  const { supabase, session, profile } = await parent();

  if (!isMember(profile) && !isTeamLeader(profile) && !isAdmin(profile)) {
    const params = new URLSearchParams({
      reason: 'Access denied. Member, Team Leader, or Admin role required.',
      role: 'Member, Team Leader, or Admin'
    });
    throw redirect(302, `/unauthorized?${params.toString()}`);
  }

  return {
    supabase,
    session,
    profile
  };
} 

