export const ROLES = {
  MEMBER: "Member",
  TEAM_LEADER: "Team Leader",
  ADMIN: "Admin",
};

export const ROLE_IDS = {
  MEMBER: "d41c0b3c-578e-417d-9842-2d955fa8ec18",
  TEAM_LEADER: "f8ef63a0-79ce-4fd2-b832-259a45a8fe94",
  ADMIN: "f6e8c3b5-8330-40df-a8f6-32a4c64f7fc7",
};

/**
 *
 * @param {Object} profile
 * @returns {Object}
 */
export function getUserRole(profile) {
  if (!profile || !profile.role_id) {
    return null;
  }

  if (typeof profile.role_id === "object") {
    return profile.role_id;
  }

  const roleIdToName = {
    [ROLE_IDS.MEMBER]: ROLES.MEMBER,
    [ROLE_IDS.TEAM_LEADER]: ROLES.TEAM_LEADER,
    [ROLE_IDS.ADMIN]: ROLES.ADMIN,
  };

  return {
    name: roleIdToName[profile.role_id] || "Unknown",
    id: profile.role_id,
  };
}

/**

 * @param {Object} profile
 * @param {string} requiredRole 
 * @returns {boolean} 
 */
export function hasRole(profile, requiredRole) {
  const userRole = getUserRole(profile);
  return userRole && userRole.name === requiredRole;
}

/**
 *
 * @param {Object} profile
 * @param {string[]} allowedRoles
 * @returns {boolean}
 */
export function hasAnyRole(profile, allowedRoles) {
  const userRole = getUserRole(profile);
  return userRole && allowedRoles.includes(userRole.name);
}

/**
 * @param {Object} profile
 * @returns {boolean}
 */
export function canAccessAdmin(profile) {
  return hasRole(profile, ROLES.ADMIN);
}

/**
 * @param {Object} profile
 * @returns {boolean}
 */
export function canAccessTeamLeader(profile) {
  return hasAnyRole(profile, [ROLES.TEAM_LEADER, ROLES.ADMIN]);
}

/**
 * @param {Object} profile
 * @returns {boolean}
 */
export function canAccessMember(profile) {
  return hasAnyRole(profile, [ROLES.MEMBER, ROLES.TEAM_LEADER, ROLES.ADMIN]);
}

/**
 * @param {Object} profile
 * @returns {string}
 */
export function getDefaultRouteForRole(profile) {
  const userRole = getUserRole(profile);

  if (!userRole) {
    return "/dashboard";
  }

  switch (userRole.name) {
    case ROLES.ADMIN:
      return "/users/ad";
    case ROLES.TEAM_LEADER:
      return "/users/tl";
    case ROLES.MEMBER:
      return "/users/me";
    default:
      return "/dashboard";
  }
}

/**
 * @param {string[]} allowedRoles
 * @returns {Function}
 */
export function createAuthCheck(allowedRoles) {
  return function (profile) {
    if (!profile) {
      return {
        authorized: false,
        reason: "No profile found",
      };
    }

    const userRole = getUserRole(profile);
    if (!userRole) {
      return {
        authorized: false,
        reason: "No role assigned",
      };
    }

    if (!allowedRoles.includes(userRole.name)) {
      return {
        authorized: false,
        reason: `Access denied. Required roles: ${allowedRoles.join(
          ", "
        )}. Your role: ${userRole.name}`,
      };
    }

    return {
      authorized: true,
      role: userRole,
    };
  };
}
