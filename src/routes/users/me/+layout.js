import { redirect } from '@sveltejs/kit';
import { createAuthCheck, ROLES } from '$lib/auth/roles.js';

export async function load({ parent, url }) {
  const { supabase, session, profile } = await parent();

  // Check if user has member, team leader, or admin access
  const authCheck = createAuthCheck([ROLES.MEMBER, ROLES.TEAM_LEADER, ROLES.ADMIN]);
  const authResult = authCheck(profile);

  if (!authResult.authorized) {
    // Redirect to unauthorized page with reason
    const params = new URLSearchParams({
      reason: authResult.reason,
      role: `${ROLES.MEMBER}, ${ROLES.TEAM_LEADER}, or ${ROLES.ADMIN}`
    });
    throw redirect(302, `/unauthorized?${params.toString()}`);
  }

  return {
    supabase,
    session,
    profile,
    userRole: authResult.role
  };
} 

