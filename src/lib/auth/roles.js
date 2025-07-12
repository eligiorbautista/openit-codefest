// Role IDs from the database
export const ROLE_IDS = {
  MEMBER: "d41c0b3c-578e-417d-9842-2d955fa8ec18",
  TEAM_LEADER: "f8ef63a0-79ce-4fd2-b832-259a45a8fe94",
  ADMIN: "f6e8c3b5-8330-40df-a8f6-32a4c64f7fc7",
};

export function isAdmin(profile) {
  if (!profile || !profile.role_id) return false;

  const roleId =
    typeof profile.role_id === "object" ? profile.role_id.id : profile.role_id;
  return roleId === ROLE_IDS.ADMIN;
}

export function isTeamLeader(profile) {
  if (!profile || !profile.role_id) return false;

  const roleId =
    typeof profile.role_id === "object" ? profile.role_id.id : profile.role_id;
  return roleId === ROLE_IDS.TEAM_LEADER;
}

export function isMember(profile) {
  if (!profile || !profile.role_id) return false;

  const roleId =
    typeof profile.role_id === "object" ? profile.role_id.id : profile.role_id;
  return roleId === ROLE_IDS.MEMBER;
}

export function getRoleName(profile) {
  if (isAdmin(profile)) return "Admin";
  if (isTeamLeader(profile)) return "Team Leader";
  if (isMember(profile)) return "Member";
  return "Unknown";
}
