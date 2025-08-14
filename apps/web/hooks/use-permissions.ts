"use client"

import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canAccessResource 
} from "@/lib/rbac"

export function usePermissions() {
  const { data: session } = useSession()
  
  const userRole = session?.user?.role || "user"
  const userId = session?.user?.id

  const permissions = useMemo(() => ({
    // Check single permission
    hasPermission: (permission: Permission) => {
      return hasPermission(userRole, permission)
    },

    // Check if user has any of the provided permissions
    hasAnyPermission: (permissions: Permission[]) => {
      return hasAnyPermission(userRole, permissions)
    },

    // Check if user has all of the provided permissions
    hasAllPermissions: (permissions: Permission[]) => {
      return hasAllPermissions(userRole, permissions)
    },

    // Check if user can access a specific resource
    canAccessResource: (resourceUserId: string, permission: Permission) => {
      if (!userId) return false
      return canAccessResource(userRole, userId, resourceUserId, permission)
    },

    // Role checks
    isUser: () => userRole === "user",
    isAdmin: () => userRole === "admin",
    isSupport: () => userRole === "support",
    
    // Get current user info
    getCurrentUser: () => session?.user,
    getUserRole: () => userRole,
    getUserId: () => userId,
  }), [userRole, userId, session])

  return permissions
}

// Hook for checking specific permission
export function useHasPermission(permission: Permission) {
  const { hasPermission } = usePermissions()
  return hasPermission(permission)
}

// Hook for checking multiple permissions
export function useHasAnyPermission(permissions: Permission[]) {
  const { hasAnyPermission } = usePermissions()
  return hasAnyPermission(permissions)
}

// Hook for checking if user can access resource
export function useCanAccessResource(resourceUserId: string, permission: Permission) {
  const { canAccessResource } = usePermissions()
  return canAccessResource(resourceUserId, permission)
}

// Hook for role-based rendering
export function useRoleGuard() {
  const { isUser, isAdmin, isSupport } = usePermissions()
  
  return {
    isUser,
    isAdmin,
    isSupport,
    renderForRole: (role: "user" | "admin" | "support", component: React.ReactNode) => {
      switch (role) {
        case "user":
          return isUser() ? component : null
        case "admin":
          return isAdmin() ? component : null
        case "support":
          return isSupport() ? component : null
        default:
          return null
      }
    },
    renderForPermission: (permission: Permission, component: React.ReactNode) => {
      const { hasPermission } = usePermissions()
      return hasPermission(permission) ? component : null
    }
  }
}