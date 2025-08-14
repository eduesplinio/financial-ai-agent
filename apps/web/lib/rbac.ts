// Role definitions
export enum Role {
  USER = "user",
  ADMIN = "admin",
  SUPPORT = "support",
}

// Permission definitions
export enum Permission {
  // User permissions
  READ_OWN_PROFILE = "read:own_profile",
  UPDATE_OWN_PROFILE = "update:own_profile",
  READ_OWN_TRANSACTIONS = "read:own_transactions",
  CREATE_OWN_TRANSACTIONS = "create:own_transactions",
  READ_OWN_GOALS = "read:own_goals",
  CREATE_OWN_GOALS = "create:own_goals",
  UPDATE_OWN_GOALS = "update:own_goals",
  DELETE_OWN_GOALS = "delete:own_goals",
  USE_CHAT = "use:chat",
  
  // Admin permissions
  READ_ALL_USERS = "read:all_users",
  UPDATE_ALL_USERS = "update:all_users",
  DELETE_USERS = "delete:users",
  READ_ALL_TRANSACTIONS = "read:all_transactions",
  READ_SYSTEM_LOGS = "read:system_logs",
  MANAGE_SYSTEM_SETTINGS = "manage:system_settings",
  
  // Support permissions
  READ_USER_PROFILES = "read:user_profiles",
  UPDATE_USER_PROFILES = "update:user_profiles",
  READ_USER_TRANSACTIONS = "read:user_transactions",
  ASSIST_USERS = "assist:users",
}

// Role-Permission mapping
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.READ_OWN_TRANSACTIONS,
    Permission.CREATE_OWN_TRANSACTIONS,
    Permission.READ_OWN_GOALS,
    Permission.CREATE_OWN_GOALS,
    Permission.UPDATE_OWN_GOALS,
    Permission.DELETE_OWN_GOALS,
    Permission.USE_CHAT,
  ],
  [Role.SUPPORT]: [
    // Support inherits all user permissions
    ...rolePermissions[Role.USER] || [],
    Permission.READ_USER_PROFILES,
    Permission.UPDATE_USER_PROFILES,
    Permission.READ_USER_TRANSACTIONS,
    Permission.ASSIST_USERS,
  ],
  [Role.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],
}

// Helper functions
export function hasPermission(userRole: string, permission: Permission): boolean {
  const role = userRole as Role
  const permissions = rolePermissions[role] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(userRole: string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

export function canAccessResource(
  userRole: string,
  userId: string,
  resourceUserId: string,
  permission: Permission
): boolean {
  // Users can always access their own resources
  if (userId === resourceUserId && hasPermission(userRole, permission)) {
    return true
  }
  
  // Check if user has permission to access other users' resources
  const globalPermission = getGlobalPermission(permission)
  return globalPermission ? hasPermission(userRole, globalPermission) : false
}

function getGlobalPermission(permission: Permission): Permission | null {
  const permissionMap: Record<Permission, Permission | null> = {
    [Permission.READ_OWN_PROFILE]: Permission.READ_USER_PROFILES,
    [Permission.UPDATE_OWN_PROFILE]: Permission.UPDATE_USER_PROFILES,
    [Permission.READ_OWN_TRANSACTIONS]: Permission.READ_USER_TRANSACTIONS,
    [Permission.CREATE_OWN_TRANSACTIONS]: null,
    [Permission.READ_OWN_GOALS]: null,
    [Permission.CREATE_OWN_GOALS]: null,
    [Permission.UPDATE_OWN_GOALS]: null,
    [Permission.DELETE_OWN_GOALS]: null,
    [Permission.USE_CHAT]: null,
    [Permission.READ_ALL_USERS]: null,
    [Permission.UPDATE_ALL_USERS]: null,
    [Permission.DELETE_USERS]: null,
    [Permission.READ_ALL_TRANSACTIONS]: null,
    [Permission.READ_SYSTEM_LOGS]: null,
    [Permission.MANAGE_SYSTEM_SETTINGS]: null,
    [Permission.READ_USER_PROFILES]: null,
    [Permission.UPDATE_USER_PROFILES]: null,
    [Permission.READ_USER_TRANSACTIONS]: null,
    [Permission.ASSIST_USERS]: null,
  }
  
  return permissionMap[permission] || null
}