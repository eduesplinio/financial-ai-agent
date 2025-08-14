"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/rbac"

interface RoleGuardProps {
  children: React.ReactNode
  role?: "user" | "admin" | "support"
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function RoleGuard({ 
  children, 
  role, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null 
}: RoleGuardProps) {
  const { 
    isUser, 
    isAdmin, 
    isSupport, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissions()

  // Check role-based access
  if (role) {
    let hasRole = false
    switch (role) {
      case "user":
        hasRole = isUser()
        break
      case "admin":
        hasRole = isAdmin()
        break
      case "support":
        hasRole = isSupport()
        break
    }
    
    if (!hasRole) {
      return <>{fallback}</>
    }
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    
    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Specific role guards for convenience
export function AdminOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard role="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function SupportOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard role="support" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function UserOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RoleGuard role="user" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Permission-based guard
export function PermissionGuard({ 
  children, 
  permission, 
  fallback 
}: { 
  children: React.ReactNode
  permission: Permission
  fallback?: React.ReactNode 
}) {
  return (
    <RoleGuard permission={permission} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}